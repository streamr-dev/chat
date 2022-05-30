import { call, takeEvery } from 'redux-saga/effects'
import handleError from '../../../utils/handleError'
import { renameRoom, RoomAction } from '../actions'
import renameLocalRoomSaga from './renameLocalRoomSaga'
import renameRemoteRoomSaga from './renameRemoteRoomSaga'

function* onRenameRoomAction({ payload: { roomId, name } }: ReturnType<typeof renameRoom>) {
    try {
        yield call(renameRemoteRoomSaga, roomId, name)

        yield call(renameLocalRoomSaga, roomId, name)
    } catch (e) {
        handleError(e)
    }
}

export default function* renameRoomSaga() {
    yield takeEvery(RoomAction.RenameRoom, onRenameRoomAction)
}
