import { all } from 'redux-saga/effects'
import changeAccountSaga from './changeAccountSaga'
import createRoomSaga from './createRoomSaga'
import deleteRoomSaga from './deleteRoomSaga'
import getMissingRoomsSaga from './getMissingRoomsSaga'
import renameRoomSaga from './renameRoomSaga'
import syncRoomSaga from './syncRoomSaga'

export default function* roomsSaga() {
    yield all([
        createRoomSaga(),
        renameRoomSaga(),
        deleteRoomSaga(),
        changeAccountSaga(),
        syncRoomSaga(),
        getMissingRoomsSaga(),
    ])
}
