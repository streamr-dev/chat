import Id from '$/components/Id'
import Toast, { ToastType } from '$/components/Toast'
import { Controller as ToastController } from '$/components/Toaster'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import retrieve from '$/features/delegation/helpers/retrieve'
import { selectDelegatedAccount } from '$/features/delegation/selectors'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import { IRoom } from '$/features/room/types'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller } from '$/features/toaster/helpers/toast'
import toaster from '$/features/toaster/helpers/toaster'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address, OptionalAddress } from '$/types'
import db from '$/utils/db'
import getRoomMetadata from '$/utils/getRoomMetadata'
import getUserPermissions from '$/utils/getUserPermissions'
import handleError from '$/utils/handleError'
import { call, put, select } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function pin({
    roomId,
    requester,
    streamrClient,
    provider,
}: ReturnType<typeof RoomAction.pin>['payload']) {
    return call(function* () {
        let retrievedAccess = false

        let tc: Controller | undefined

        let confirm: ToastController<typeof Toast> | undefined

        let dismissToast = false

        try {
            yield put(FlagAction.set(Flag.isRoomBeingPinned()))

            tc = yield retoast(tc, {
                title: (
                    <>
                        Pinning <Id>{roomId}</Id>…
                    </>
                ),
                type: ToastType.Processing,
            })

            dismissToast = true

            const owner = requester.toLowerCase()

            const stream: null | Stream = yield streamrClient.getStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const { createdAt, createdBy, tokenAddress, name = '' } = getRoomMetadata(stream)

            const isTokenGated = !!tokenAddress

            let delegatedAccount: OptionalAddress = yield select(selectDelegatedAccount)

            if (tokenAddress) {
                if (!delegatedAccount) {
                    confirm = yield toaster({
                        title: 'Hot wallet required',
                        type: ToastType.Warning,
                        desc: 'In order to pin this room the app will ask for your signature.',
                        okLabel: 'Ok',
                        cancelLabel: 'Cancel',
                    })

                    yield confirm?.open()

                    retrievedAccess = true

                    yield put(FlagAction.set(Flag.isAccessBeingDelegated(requester)))

                    delegatedAccount = (yield retrieve({ provider, owner })) as Address
                }

                yield put(
                    TokenGatedRoomAction.joinERC20({
                        roomId,
                        owner,
                        tokenAddress,
                        provider,
                        delegatedAccount,
                    })
                )
            }

            const room: undefined | IRoom = yield db.rooms.where({ id: stream.id, owner }).first()

            const [permissions, isPublic]: Awaited<ReturnType<typeof getUserPermissions>> =
                yield getUserPermissions(owner, stream)

            if (permissions.length) {
                dismissToast = false

                tc = yield retoast(tc, {
                    title: <>You should already have the room on your&nbsp;list</>,
                    type: ToastType.Error,
                })

                return
            }

            if (!isPublic && !isTokenGated) {
                dismissToast = false

                tc = yield retoast(tc, {
                    title: "You can't pin private rooms",
                    type: ToastType.Error,
                })

                return
            }

            if (room) {
                yield db.rooms.where({ owner, id: roomId }).modify({ pinned: true, hidden: false })
            } else {
                try {
                    yield db.rooms.add({
                        createdAt,
                        createdBy,
                        id: stream.id,
                        name,
                        owner,
                        pinned: true,
                    })
                } catch (e: any) {
                    if (!/uniqueness/.test(e?.message || '')) {
                        throw e
                    }
                }
            }

            yield put(MiscAction.goto(roomId))
        } catch (e) {
            handleError(e)

            dismissToast = false

            tc = yield retoast(tc, {
                title: 'Pinning failed',
                type: ToastType.Error,
            })
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }

            confirm?.dismiss()

            if (retrievedAccess) {
                yield put(FlagAction.unset(Flag.isAccessBeingDelegated(requester)))
            }

            yield put(FlagAction.unset(Flag.isRoomBeingPinned()))
        }
    })
}
