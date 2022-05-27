import { call, takeEvery } from 'redux-saga/effects'
import { deleteRoom, RoomAction } from '../actions'
import deleteRemoteRoomSaga from './deleteRemoteRoomSaga'
import deleteLocalRoomSaga from './deleteLocalRoomSaga'

function* onDeleteRoomAction({
    payload: [owner, id],
}: ReturnType<typeof deleteRoom>) {
    try {
        yield call(deleteRemoteRoomSaga, id)

        yield call(deleteLocalRoomSaga, id, owner.toLowerCase())
    } catch (e) {
        console.warn('Oh no!', e)
    }
}

export default function* deleteRoomSaga() {
    yield takeEvery(RoomAction.DeleteRoom, onDeleteRoomAction)
}
