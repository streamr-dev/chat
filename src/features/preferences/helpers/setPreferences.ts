import { ToastType } from '$/components/Toast'
import { IPreference } from '$/features/preferences/types'
import { MiscAction } from '$/features/misc'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import { call, put } from 'redux-saga/effects'

export default function setPreferences(preference: IPreference) {
    return call(function* () {
        try {
            const owner = preference.owner.toLowerCase()

            const numUpdated: number = yield db.preferences
                .where('owner')
                .equals(owner)
                .modify({
                    ...preference,
                    owner,
                })

            if (numUpdated === 0) {
                yield db.preferences.add({ ...preference, owner })
            }
        } catch (e) {
            handleError(e)

            yield put(
                MiscAction.toast({
                    title: i18n('preferenceToast.updateFailureTitle'),
                    type: ToastType.Error,
                })
            )
        }
    })
}
