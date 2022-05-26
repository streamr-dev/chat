import { createReducer } from '@reduxjs/toolkit'
import { StorageKey } from '../../../types/common'
import { WalletIntegrationId, WalletState } from '../../../types/wallet'
import {
    setWalletAccount,
    setWalletIntegrationId,
    setWalletProvider,
} from './actions'

const initialState: WalletState = {
    account: undefined,
    provider: undefined,
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
    })
})

export default reducer
