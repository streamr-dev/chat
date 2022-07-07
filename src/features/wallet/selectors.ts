import { selectFlag } from '$/features/flag/selectors'
import { Flag } from '$/features/flag/types'
import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { WalletState } from './types'

function selectSelf(state: State): WalletState {
    return state.wallet
}

export const selectWalletIntegrationId = createSelector(
    selectSelf,
    ({ integrationId }: WalletState) => integrationId
)

export const selectWalletAccount = createSelector(selectSelf, ({ account }: WalletState) => account)

export const selectWalletProvider = createSelector(
    selectSelf,
    ({ provider }: WalletState) => provider
)

export const selectWalletClient = createSelector(selectSelf, ({ client }) => client)


export const selectIsDelegatedAccount = createSelector(
    selectSelf,
    ({})
)