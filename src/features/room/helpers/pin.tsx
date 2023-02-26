import Id from '$/components/Id'
import { ToastType } from '$/components/Toast'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import join from '$/features/room/helpers/join'
import { IRoom } from '$/features/room/types'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller } from '$/features/toaster/helpers/toast'
import db from '$/utils/db'
import fetchStream from '$/utils/fetchStream'
import getRoomMetadata from '$/utils/getRoomMetadata'
import getUserPermissions from '$/utils/getUserPermissions'
import handleError from '$/utils/handleError'
import { call, put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function pin({
    roomId,
    requester,
    streamrClient,
}: ReturnType<typeof RoomAction.pin>['payload']) {
    return call(function* () {
        let tc: Controller | undefined

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

            const stream: Stream | null = yield fetchStream(roomId, streamrClient)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const { createdAt, createdBy, tokenAddress, name = '' } = getRoomMetadata(stream)

            if (tokenAddress) {
                yield join(stream, requester)

                return
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

            if (!isPublic) {
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

            yield put(FlagAction.unset(Flag.isRoomBeingPinned()))
        }
    })
}
