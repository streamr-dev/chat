import Id from '$/components/Id'
import { ToastType } from '$/components/Toast'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import retrieve from '$/features/delegation/helpers/retrieve'
import { selectDelegatedAccount } from '$/features/delegation/selectors'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import { IRoom } from '$/features/room/types'
import toast, { Controller } from '$/features/toaster/helpers/toast'
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

        try {
            yield put(FlagAction.set(Flag.isRoomBeingPinned()))

            tc = yield toast({
                title: (
                    <>
                        Pinning <Id>{roomId}</Id>…
                    </>
                ),
                type: ToastType.Processing,
            })

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
                tc.update({
                    title: 'You should already have the room on your list',
                    type: ToastType.Error,
                })

                return
            }

            if (!isPublic && !isTokenGated) {
                tc.update({
                    title: "You can't pin private rooms",
                    type: ToastType.Error,
                })

                return
            }

            if (room) {
                yield db.rooms.where({ owner, id: roomId }).modify({ pinned: true, hidden: false })
            } else {
                yield db.rooms.add({
                    createdAt,
                    createdBy,
                    id: stream.id,
                    name,
                    owner,
                    pinned: true,
                })
            }

            yield put(MiscAction.goto(roomId))
        } catch (e) {
            handleError(e)

            tc?.update({
                title: 'Pinning failed',
                type: ToastType.Error,
            })
        } finally {
            tc?.dismiss()

            if (retrievedAccess) {
                yield put(FlagAction.unset(Flag.isAccessBeingDelegated(requester)))
            }

            yield put(FlagAction.unset(Flag.isRoomBeingPinned()))
        }
    })
}
