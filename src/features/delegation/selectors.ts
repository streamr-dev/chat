import { createSelector } from '@reduxjs/toolkit'
import { Wallet } from 'ethers'
import { DelegationState } from './types'

function selectSelf(state: any): DelegationState {
    return state.delegation
}

export const selectDelegatedClient = createSelector(selectSelf, ({ client }) => client)

export const selectDelegatedAccount = createSelector(selectSelf, ({ privateKey }) => {
    if (!privateKey) {
        return undefined
    }

    return new Wallet(privateKey).address
})
