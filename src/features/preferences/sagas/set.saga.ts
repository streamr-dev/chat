import { PreferencesAction } from '$/features/preferences'
import { RoomAction } from '$/features/room'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { put, takeEvery } from 'redux-saga/effects'

function* onSetAction({ payload }: ReturnType<typeof PreferencesAction.set>) {
    try {
        const owner = payload.owner.toLowerCase()

        const numUpdated: number = yield db.preferences
            .where('owner')
            .equals(owner)
            .modify({
                ...payload,
                owner,
            })

        if (numUpdated === 0) {
            yield db.preferences.add({ ...payload, owner })
        }

        if ('selectedRoomId' in payload) {
            yield put(RoomAction.select(payload.selectedRoomId))
        }
    } catch (e) {
        handleError(e)

        error('Failed to update preferences.')
    }
}

export default function* set() {
    yield takeEvery(PreferencesAction.set, onSetAction)
}
