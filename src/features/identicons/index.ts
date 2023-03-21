import { createAction, createReducer } from '@reduxjs/toolkit'
import { IdenticonSeed, IdenticonsState, IIdenticon } from './types'
import { IFingerprinted } from '$/types'

const initialState: IdenticonsState = {}

export const IdenticonAction = {
    retrieve: createAction<IFingerprinted & { seed: IdenticonSeed }>('identicons: retrieve'),
    set: createAction<IIdenticon>('identicons: set'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(IdenticonAction.set, (state, { payload: { seed, content } }) => {
        state[seed] = content
    })
})

export default reducer
