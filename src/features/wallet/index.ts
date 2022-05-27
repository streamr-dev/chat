import { createReducer } from '@reduxjs/toolkit'
import { StorageKey } from '../../../types/common'
import {
    setWalletAccount,
    setWalletIntegrationId,
    setWalletProvider,
} from './actions'
import { WalletIntegrationId, WalletState } from './types'
import StreamrClient from 'streamr-client'

const initialState: WalletState = {
    account: undefined,
    provider: undefined,
    client: undefined,
    integrationId:
        (localStorage.getItem(
            StorageKey.WalletIntegrationId
        ) as WalletIntegrationId) || undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(setWalletIntegrationId, (state, { payload }) => {
        state.integrationId = payload
    })

    builder.addCase(setWalletAccount, (state, { payload }) => {
        state.account = payload
    })

    builder.addCase(setWalletProvider, (state, { payload }) => {
        state.provider = payload
        // Changing the provider makes the old account obsolete.
        state.account = null

        state.client = payload
            ? new StreamrClient({
                  auth: {
                      ethereum: payload,
                  },
              })
            : undefined
    })
})

export default reducer
