import { call, takeEvery } from 'redux-saga/effects'
import { deleteRoom, RoomAction } from '../actions'
import deleteRemoteRoomSaga from './deleteRemoteRoomSaga'
import deleteLocalRoomSaga from './deleteLocalRoomSaga'
import handleError from '../../../utils/handleError'

function* onDeleteRoomAction({ payload: { owner, roomId } }: ReturnType<typeof deleteRoom>) {
    try {
        yield call(deleteRemoteRoomSaga, roomId)

        yield call(deleteLocalRoomSaga, roomId, owner.toLowerCase())
    } catch (e) {
        handleError(e)
    }
}

export default function* deleteRoomSaga() {
    yield takeEvery(RoomAction.DeleteRoom, onDeleteRoomAction)
}
