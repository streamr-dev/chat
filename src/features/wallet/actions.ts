import { createAction } from '@reduxjs/toolkit'
import { WalletState } from '../../../types/wallet'

export enum WalletAction {
    SetWalletIntegrationId = 'set wallet integration id',
    SetWalletAccount = 'set wallet account',
}

export const setWalletIntegrationId = createAction<
    WalletState['integrationId']
>(WalletAction.SetWalletIntegrationId)

export const setWalletAccount = createAction<WalletState['account']>(
    WalletAction.SetWalletAccount
)
