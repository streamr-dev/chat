import { call, takeEvery } from 'redux-saga/effects'
import { renameRoom, RoomAction } from '../actions'
import renameLocalRoomSaga from './renameLocalRoomSaga'
import renameRemoteRoomSaga from './renameRemoteRoomSaga'

function* onRenameRoomAction({ payload: { roomId, name } }: ReturnType<typeof renameRoom>) {
    try {
        yield call(renameRemoteRoomSaga, roomId, name)

        yield call(renameLocalRoomSaga, roomId, name)
    } catch (e) {
        console.warn('Oh no! `onRenameRoomAction` failed', e)
    }
}

export default function* renameRoomSaga() {
    yield takeEvery(RoomAction.RenameRoom, onRenameRoomAction)
}
