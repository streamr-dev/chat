import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'
import { WalletState } from './types'

function selectSelf(state: State): WalletState {
    return state.wallet
}

export const selectWalletIntegrationId = createSelector(
    selectSelf,
    ({ integrationId }: WalletState) => integrationId
)

export const selectWalletAccount = createSelector(selectSelf, ({ account }: WalletState) => account)

export const selectWalletClient = createSelector(selectSelf, ({ client }) => client)
