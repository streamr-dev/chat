import { createAction, createReducer } from '@reduxjs/toolkit'
import { Address, OptionalAddress, StorageKey } from '$/types'
import { WalletIntegrationId, WalletState } from './types'
import StreamrClient from '@streamr/sdk'

const initialState: WalletState = {
    account: undefined,
    client: undefined,
    transactionalClient: undefined,
    integrationId:
        (localStorage.getItem(StorageKey.WalletIntegrationId) as WalletIntegrationId) || undefined,
}

export const WalletAction = {
    setIntegrationId: createAction<WalletState['integrationId']>('wallet: set integration id'),

    setAccount: createAction<OptionalAddress>('wallet: set account'),

    changeAccount: createAction<{ account: Address; streamrClient: StreamrClient } | undefined>(
        'wallet: change account'
    ),

    connect: createAction<WalletIntegrationId>('wallet: connect'),

    connectEagerly: createAction('wallet: connect eagerly'),

    setTransactionalClient: createAction<{ streamrClient: StreamrClient }>(
        'wallet: set transactional client'
    ),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(WalletAction.setIntegrationId, (state, { payload: integrationId }) => {
        state.integrationId = integrationId
    })

    builder.addCase(WalletAction.changeAccount, (state, { payload }) => {
        state.client = payload?.streamrClient

        state.account = payload?.account

        /**
         * Let's use the initial client instance for transactions. It'll get
         * overwritten when the network conditions change.
         */
        state.transactionalClient = state.client
    })

    builder.addCase(
        WalletAction.setTransactionalClient,
        (state, { payload: { streamrClient } }) => {
            state.transactionalClient = streamrClient
        }
    )
})

export default reducer
