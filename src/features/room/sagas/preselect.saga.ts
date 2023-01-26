import { IPreference } from '$/features/preferences/types'
import { RoomAction } from '$/features/room'
import { IRoom } from '$/features/room/types'
import db from '$/utils/db'
import { error, success } from '$/utils/toaster'
import { fork, put, take } from 'redux-saga/effects'

export default function* preselect() {
    while (true) {
        const {
            payload: { roomId, account },
        }: ReturnType<typeof RoomAction.preselect> = yield take(RoomAction.preselect)

        yield fork(function* () {
            if (!account) {
                yield put(RoomAction.select(undefined))
                return
            }

            if (!roomId) {
                const preferences: null | IPreference = yield db.preferences
                    .where('owner')
                    .equals(account.toLowerCase())
                    .first()

                yield put(RoomAction.select(preferences?.selectedRoomId))

                return
            }

            let selectedRoom: null | IRoom = null

            try {
                selectedRoom = yield db.rooms
                    .where({
                        owner: account.toLowerCase(),
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
                        yield db.rooms
                            .where({ owner: selectedRoom.owner, id: selectedRoom.id })
                            .modify({
                                hidden: false,
                            })
                    } catch (e) {
                        error('Failed to unhide a room.')
                    }
                }

                yield put(RoomAction.select(roomId))

                return
            }

            error('It is not your room!')
        })
    }
}
