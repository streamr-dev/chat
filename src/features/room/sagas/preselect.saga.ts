import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { IPreference } from '$/features/preferences/types'
import { RoomAction } from '$/features/room'
import { IRoom } from '$/features/room/types'
import { EnhancedStream } from '$/types'
import db from '$/utils/db'
import getStream from '$/utils/getStream'
import getStreamMetadata from '$/utils/getStreamMetadata'
import getUserPermissions, { UserPermissions } from '$/utils/getUserPermissions'
import { error } from '$/utils/toaster'
import { fork, put, take } from 'redux-saga/effects'

export default function* preselect() {
    while (true) {
        const {
            payload: { roomId, account, streamrClient },
        }: ReturnType<typeof RoomAction.preselect> = yield take(RoomAction.preselect)

        yield fork(function* () {
            if (!account) {
                yield put(RoomAction.select(undefined))
                return
            }

            const owner = account.toLowerCase()

            if (!roomId) {
                const preferences: null | IPreference = yield db.preferences
                    .where('owner')
                    .equals(owner)
                    .first()

                yield put(RoomAction.select(preferences?.selectedRoomId))

                return
            }

            let selectedRoom: null | IRoom = null

            try {
                selectedRoom = yield db.rooms
                    .where({
                        owner,
                        id: roomId,
                    })
                    .first()
            } catch (e) {
                error('Failed to find the room')

                return
            }

            if (selectedRoom) {
                if (selectedRoom.hidden) {
                    try {
                        yield db.rooms.where({ owner, id: roomId }).modify({
                            hidden: false,
                        })
                    } catch (e) {
                        error('Failed to unhide a room.')
                    }
                }

                yield put(RoomAction.select(roomId))

                return
            }

            try {
                const stream: undefined | EnhancedStream = yield getStream(streamrClient, roomId)

                if (!stream) {
                    throw new RoomNotFoundError(roomId)
                }

                const { createdAt, createdBy, name } = getStreamMetadata(stream)

                const [permissions, isPublic]: UserPermissions = yield getUserPermissions(
                    owner,
                    stream
                )

                if (!permissions.length && !isPublic) {
                    error("You don't have access to the requested room.")
                    return
                }

                const pinned = !permissions.length

                const numModded: number = yield db.rooms
                    .where({ owner, id: roomId })
                    .modify({ pinned, hidden: false })

                if (numModded !== 0) {
                    return
                }

                try {
                    yield db.rooms.add({
                        createdAt: createdAt,
                        createdBy: createdBy,
                        id: stream.id,
                        name: name || '',
                        owner,
                        pinned,
                    })
                } catch (e: any) {
                    if (!/uniqueness/.test(e.message)) {
                        throw e
                    }
                }

                yield put(RoomAction.select(roomId))
            } catch (e) {
                error('Failed to open the room')
            }
        })
    }
}
