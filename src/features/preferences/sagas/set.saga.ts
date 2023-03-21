import { ToastType } from '$/components/Toast'
import { PreferencesAction } from '$/features/preferences'
import { ToasterAction } from '$/features/toaster'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
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
    } catch (e) {
        handleError(e)

        yield put(
            ToasterAction.show({
                title: i18n('preferenceToast.updateFailureTitle'),
                type: ToastType.Error,
            })
        )
    }
}

export default function* set() {
    yield takeEvery(PreferencesAction.set, onSetAction)
}
