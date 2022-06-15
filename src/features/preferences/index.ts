import set from '$/features/preferences/sagas/set.saga'
import { IPreference, PreferencesState } from '$/features/preferences/types'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'

export const PreferencesAction = {
    set: createAction<IPreference>('preferences: set'),
    setIsSetting: createAction<{ owner: Address; state: boolean }>('preferences: set is setting'),
}

const initianState: PreferencesState = {
    ongoingSetting: {},
}

const reducer = createReducer(initianState, (builder) => {
    builder.addCase(PreferencesAction.set, SEE_SAGA)

    builder.addCase(
        PreferencesAction.setIsSetting,
        (state, { payload: { owner, state: isSetting } }) => {
            state.ongoingSetting[owner.toLowerCase()] = isSetting
        }
    )
})

export function* preferencesSaga() {
    yield all([set()])
}

export default reducer
