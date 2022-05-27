import { createAction } from '@reduxjs/toolkit'
import { WalletState } from './types'

export enum WalletAction {
    SetWalletIntegrationId = 'set wallet integration id',
    SetWalletAccount = 'set wallet account',
    SetWalletProvider = 'set wallet provider',
}

export const setWalletIntegrationId = createAction<
    WalletState['integrationId']
>(WalletAction.SetWalletIntegrationId)

export const setWalletAccount = createAction<WalletState['account']>(
    WalletAction.SetWalletAccount
)

export const setWalletProvider = createAction<WalletState['provider']>(
    WalletAction.SetWalletProvider
)
