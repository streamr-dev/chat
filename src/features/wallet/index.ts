import { createAction, createReducer } from '@reduxjs/toolkit'
import { Address, OptionalAddress, StorageKey } from '$/types'
import { WalletIntegrationId, WalletState } from './types'
import StreamrClient from 'streamr-client'

const initialState: WalletState = {
    account: undefined,
    client: undefined,
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
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(WalletAction.setIntegrationId, (state, { payload: integrationId }) => {
        state.integrationId = integrationId
    })

    builder.addCase(WalletAction.changeAccount, (state, { payload }) => {
        Object.assign(state, {
            client: payload?.streamrClient,
            account: payload?.account,
        })
    })
})

export default reducer
