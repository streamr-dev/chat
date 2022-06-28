import set from '$/features/preferences/sagas/set.saga'
import { IPreference } from '$/features/preferences/types'
import { SEE_SAGA } from '$/utils/consts'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'

export const PreferencesAction = {
    set: createAction<IPreference>('preferences: set'),
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(PreferencesAction.set, SEE_SAGA)
})

export function* preferencesSaga() {
    yield all([set()])
}

export default reducer
