import { all } from 'redux-saga/effects'
import changeAccountSaga from './changeAccountSaga'
import createRoomSaga from './createRoomSaga'
import deleteRoomSaga from './deleteRoomSaga'
import renameRoomSaga from './renameRoomSaga'

export default function* roomsSaga() {
    yield all([
        createRoomSaga(),
        renameRoomSaga(),
        deleteRoomSaga(),
        changeAccountSaga(),
    ])
}
