import db from '../../../utils/db'
import { put, select, takeEvery } from 'redux-saga/effects'
import { deleteRoom, RoomAction, selectRoom } from '../actions'
import { selectSelectedRoomId } from '../selectors'
import { IRoom, RoomsState } from '../types'

function* onDeleteRoomAction({
    payload: [owner, id],
}: ReturnType<typeof deleteRoom>) {
    try {
        const o = owner.toLowerCase()

        // Delete room messages for a given record owner.
        yield db.messages.where({ owner: o, roomId: id }).delete()

        // Delete room for a given record owner.
        yield db.rooms.where({ owner: o, id }).delete()

        const selectedRoomId: RoomsState['selectedId'] = yield select(
            selectSelectedRoomId
        )

        if (selectedRoomId !== id) {
            return
        }

        // Select a different room.
        const room: undefined | IRoom = yield db.rooms
            .where({ owner: o })
            .first()

        yield put(selectRoom(room ? room.id : undefined))
    } catch (e) {
        console.warn('Oh no!', e)
    }
}

export default function* deleteRoomSaga() {
    yield takeEvery(RoomAction.DeleteRoom, onDeleteRoomAction)
}
