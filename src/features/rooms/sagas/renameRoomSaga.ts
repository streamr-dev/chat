import db from '../../../utils/db'
import { takeEvery } from 'redux-saga/effects'
import { renameRoom, RoomAction } from '../actions'

function* onRenameRoomAction({
    payload: [id, name],
}: ReturnType<typeof renameRoom>) {
    try {
        // Rename rooms for all record owners.
        yield db.rooms.where({ id }).modify({ name })
    } catch (e) {
        console.warn('Oh no!', e)
    }
}

export default function* renameRoomSaga() {
    yield takeEvery(RoomAction.RenameRoom, onRenameRoomAction)
}
