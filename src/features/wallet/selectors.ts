import { createSelector } from '@reduxjs/toolkit'
import { WalletState } from '../../../types/wallet'

function selectSelf(state: any): WalletState {
    return state.wallet
}

export const selectWalletIntegrationId = createSelector(
    selectSelf,
    (substate: WalletState) => substate.integrationId
)

export const selectWalletAccount = createSelector(
    selectSelf,
    (substate: WalletState) => substate.account
)
