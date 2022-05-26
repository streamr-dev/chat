import { createReducer } from '@reduxjs/toolkit'
import { setDelegatedAccount, setDelegatedPrivateKey } from './actions'
import { DelegationState } from './types'

const initialState: DelegationState = {
    account: undefined,
    privateKey: undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(setDelegatedAccount, (state, { payload }) => {
        state.account = payload
    })

    builder.addCase(setDelegatedPrivateKey, (state, { payload }) => {
        state.privateKey = payload
    })
})

export default reducer
