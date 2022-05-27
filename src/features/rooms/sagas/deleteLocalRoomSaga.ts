import { put, select } from 'redux-saga/effects'
import db from '../../../utils/db'
import { selectRoom } from '../actions'
import { selectSelectedRoomId } from '../selectors'
import { IRoom, RoomId, RoomsState } from '../types'

export default function* deleteLocalRoomSaga(id: RoomId, owner: string) {
    // Delete room messages for a given record owner.
    yield db.messages.where({ owner, roomId: id }).delete()

    // Delete room for a given record owner.
    yield db.rooms.where({ owner, id }).delete()

    const selectedRoomId: RoomsState['selectedId'] = yield select(
        selectSelectedRoomId
    )

    if (selectedRoomId !== id) {
        return
    }

    // Select a different room.
    const room: undefined | IRoom = yield db.rooms.where({ owner }).first()

    yield put(selectRoom(room ? room.id : undefined))
}
