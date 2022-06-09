import { createReducer } from '@reduxjs/toolkit'
import StreamrClient from 'streamr-client'
import { SEE_SAGA } from '$/utils/consts'
import { DelegationState } from './types'

const initialState: DelegationState = {
    privateKey: undefined,
    client: undefined,
}

import { createAction } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import requestPrivateKey from './sagas/requestPrivateKey.saga'

export const DelegationAction = {
    setPrivateKey: createAction<string | undefined>('delegation: set delegated private key'),
    requestPrivateKey: createAction('delegation: request private key'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(DelegationAction.setPrivateKey, (state, { payload: privateKey }) => {
        state.privateKey = privateKey || undefined

        state.client = privateKey
            ? new StreamrClient({
                  auth: {
                      privateKey,
                  },
              })
            : undefined
    })

    builder.addCase(DelegationAction.requestPrivateKey, SEE_SAGA)
})

export function* delegationSaga() {
    yield all([requestPrivateKey()])
}

export default reducer
