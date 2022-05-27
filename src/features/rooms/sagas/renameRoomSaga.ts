import { call, takeEvery } from 'redux-saga/effects'
import { renameRoom, RoomAction } from '../actions'
import renameLocalRoomSaga from './renameLocalRoomSaga'
import renameRemoteRoomSaga from './renameRemoteRoomSaga'

function* onRenameRoomAction({
    payload: [id, name],
}: ReturnType<typeof renameRoom>) {
    try {
        yield call(renameRemoteRoomSaga, id, name)

        yield call(renameLocalRoomSaga, id, name)
    } catch (e) {
        console.warn('Oh no! `onRenameRoomAction` failed', e)
    }
}

export default function* renameRoomSaga() {
    yield takeEvery(RoomAction.RenameRoom, onRenameRoomAction)
}
