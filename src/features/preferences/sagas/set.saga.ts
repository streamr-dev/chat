import { PreferencesAction } from '$/features/preferences'
import { selectIsSetting } from '$/features/preferences/selectors'
import { RoomAction } from '$/features/room'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { put, select, takeEvery } from 'redux-saga/effects'

export default function* set() {
    yield takeEvery(PreferencesAction.set, function* ({ payload }) {
        let dirty = false

        const owner = payload.owner.toLowerCase()

        try {
            const isSetting: boolean = yield select(selectIsSetting(owner))

            if (isSetting) {
                return
            }

            yield put(
                PreferencesAction.setIsSetting({
                    owner,
                    state: true,
                })
            )

            dirty = true

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
        } finally {
            if (dirty) {
                yield put(
                    PreferencesAction.setIsSetting({
                        owner,
                        state: false,
                    })
                )
            }
        }
    })
}
