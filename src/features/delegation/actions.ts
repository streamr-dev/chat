import { createAction } from '@reduxjs/toolkit'
import { DelegationState } from './types'

export enum DelegationAction {
    SetDelegatedAccount = 'set delegated account',
    SetDelegatedPrivateKey = 'set delegated private key',
}

export const setDelegatedAccount = createAction<DelegationState['account']>(
    DelegationAction.SetDelegatedAccount
)

export const setDelegatedPrivateKey = createAction<
    DelegationState['privateKey']
>(DelegationAction.SetDelegatedPrivateKey)
