import { createAction } from '@reduxjs/toolkit'

export enum DelegationAction {
    SetDelegatedPrivateKey = 'set delegated private key',
    RequestDelegatedPrivateKey = 'request delegated private key',
}

export const setDelegatedPrivateKey = createAction<string | undefined>(
    DelegationAction.SetDelegatedPrivateKey
)

export const requestDelegatedPrivateKey = createAction(DelegationAction.RequestDelegatedPrivateKey)
