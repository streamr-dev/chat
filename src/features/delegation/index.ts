import { createReducer } from '@reduxjs/toolkit'
import StreamrClient from 'streamr-client'
import { requestDelegatedPrivateKey, setDelegatedPrivateKey } from './actions'
import { DelegationState } from './types'

const initialState: DelegationState = {
    privateKey: undefined,
    client: undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(setDelegatedPrivateKey, (state, { payload: privateKey }) => {
        state.privateKey = privateKey || undefined

        state.client = privateKey
            ? new StreamrClient({
                  auth: {
                      privateKey,
                  },
              })
            : undefined
    })

    builder.addCase(requestDelegatedPrivateKey, () => {
        // Do nothing. See delegation's sagas.
    })
})

export default reducer
