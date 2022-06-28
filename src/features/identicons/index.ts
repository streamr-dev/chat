import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import retrieve from './sagas/retrieve.saga'
import { IdenticonSeed, IdenticonsState, IIdenticon } from './types'
import { IFingerprinted } from '$/types'

const initialState: IdenticonsState = {}

export const IdenticonAction = {
    retrieve: createAction<IFingerprinted & { seed: IdenticonSeed }>('identicons: retrieve'),
    set: createAction<IIdenticon>('identicons: set'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(IdenticonAction.retrieve, SEE_SAGA)

    builder.addCase(IdenticonAction.set, (state, { payload: { seed, content } }) => {
        state[seed] = content
    })
})

export function* identiconsSaga() {
    yield all([retrieve()])
}

export default reducer
