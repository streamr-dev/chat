import { createReducer } from '@reduxjs/toolkit'
import { requestDelegatedPrivateKey, setDelegatedPrivateKey } from './actions'
import { DelegationState } from './types'

const initialState: DelegationState = {
    privateKey: undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(setDelegatedPrivateKey, (state, { payload }) => {
        state.privateKey = payload || undefined
    })

    builder.addCase(requestDelegatedPrivateKey, () => {
        // Do nothing. See delegation's sagas.
    })
})

export default reducer
