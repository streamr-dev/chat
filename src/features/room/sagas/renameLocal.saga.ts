import { takeEvery } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import db from '$/utils/db'

function* onRenameLocalAction({ payload: { roomId, name } }: ReturnType<typeof RoomAction.rename>) {
    try {
        // Rename rooms for all record owners.
        yield db.rooms.where('id').equals(roomId).modify({ name })
    } catch (e) {
        handleError(e)
    }
}

export default function* renameLocal() {
    yield takeEvery(RoomAction.renameLocal, onRenameLocalAction)
}
