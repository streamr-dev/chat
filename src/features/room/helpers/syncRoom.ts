import { call, put } from 'redux-saga/effects'
import { Stream } from '@streamr/sdk'
import handleError from '$/utils/handleError'
import { RoomAction } from '..'
import { IRoom } from '$/features/room/types'
import db from '$/utils/db'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import getRoomMetadata, { RoomMetadata } from '$/utils/getRoomMetadata'
import fetchStream from '$/utils/fetchStream'

export default function syncRoom({
    roomId,
    requester,
}: ReturnType<typeof RoomAction.sync>['payload']) {
    return call(function* () {
        try {
            const stream: Stream | null = yield fetchStream(roomId)

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
                    const { name = '' }: RoomMetadata = yield getRoomMetadata(stream)

                    yield put(
                        RoomAction.renameLocal({
                            roomId,
                            name,
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
    })
}
