import { createSelector } from '@reduxjs/toolkit'
import { WalletState } from '../../../types/wallet'

function selectSelf(state: any): WalletState {
    return state.wallet
}

export const selectWalletIntegrationId = createSelector(
    selectSelf,
    ({ integrationId }: WalletState) => integrationId
)

export const selectWalletAccount = createSelector(
    selectSelf,
    ({ account }: WalletState) => account
)

export const selectWalletProvider = createSelector(
    selectSelf,
    ({ provider }: WalletState) => provider
)
