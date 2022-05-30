import { createSelector } from '@reduxjs/toolkit'
import { Wallet } from 'ethers'
import { DelegationState } from './types'

function selectSelf(state: any): DelegationState {
    return state.delegation
}

export const selectDelegatedPrivateKey = createSelector(selectSelf, ({ privateKey }) => privateKey)

export const selectDelegatedAccount = createSelector(selectDelegatedPrivateKey, (privateKey) =>
    privateKey ? new Wallet(privateKey).address : undefined
)

export const selectDelegatedClient = createSelector(selectSelf, ({ client }) => client)
