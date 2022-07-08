import { createAction, createReducer } from '@reduxjs/toolkit'
import { StorageKey } from '$/types'
import { WalletIntegrationId, WalletState } from './types'
import StreamrClient from 'streamr-client'
import { all } from 'redux-saga/effects'
import setAccount from './sagas/setAccount.saga'
import setIntegrationId from './sagas/setIntegrationId.saga'
import setProvider from './sagas/setProvider.saga'

const initialState: WalletState = {
    account: undefined,
    provider: undefined,
    client: undefined,
    delegatedAccounts: {},
    integrationId:
        (localStorage.getItem(StorageKey.WalletIntegrationId) as WalletIntegrationId) || undefined,
}

export const WalletAction = {
    setIntegrationId: createAction<WalletState['integrationId']>('wallet: set integration id'),

    setAccount: createAction<WalletState['account']>('wallet: set account'),

    setProvider: createAction<WalletState['provider']>('wallet: set provider'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(WalletAction.setIntegrationId, (state, { payload: integrationId }) => {
        state.integrationId = integrationId
    })

    builder.addCase(WalletAction.setAccount, (state, { payload: account }) => {
        state.account = account
    })

    builder.addCase(WalletAction.setProvider, (state, { payload: provider }) => {
        state.provider = provider

        state.client = provider
            ? new StreamrClient({
                  auth: {
                      ethereum: provider,
                  },
                  gapFill: false,
              })
            : undefined

        // Changing the provider makes the old account obsolete.
        state.account = null
    })
})

export function* walletSaga() {
    yield all([setAccount(), setIntegrationId(), setProvider()])
}

export default reducer
