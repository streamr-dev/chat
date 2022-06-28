import { put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import { RoomAction } from '..'
import { IRoom } from '$/features/room/types'
import db from '$/utils/db'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onSyncAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof RoomAction.sync>) {
    try {
        const stream: undefined | Stream = yield getStream(streamrClient, roomId)

        if (stream) {
            const [permissions, isPublic]: UserPermissions = yield getUserPermissions(
                requester,
                stream
            )

            let pinned = false

            if (isPublic) {
                const room: undefined | IRoom = yield db.rooms
                    .where({ owner: requester.toLowerCase() || '', id: roomId })
                    .first()

                pinned = Boolean(room?.pinned)
            }

            if (permissions.length || pinned) {
                yield put(
                    RoomAction.renameLocal({
                        roomId,
                        name: stream.description || '',
                    })
                )

                return
            }
        }

        // At this point we know that the stream isn't there, or we don't have anything to do with
        // it (no explicit permissions). Let's remove it from the navigation sidebar.

        yield put(RoomAction.deleteLocal({ roomId, requester }))
    } catch (e) {
        handleError(e)
    }
}

export default function* sync() {
    yield takeEveryUnique(RoomAction.sync, onSyncAction)
}
