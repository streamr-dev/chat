import { createAction, createReducer } from '@reduxjs/toolkit'
import { Address, StorageKey } from '$/types'
import { WalletIntegrationId, WalletState } from './types'
import StreamrClient from 'streamr-client'
import { Provider } from '@web3-react/types'
import { SEE_SAGA } from '$/utils/consts'

const initialState: WalletState = {
    account: undefined,
    provider: undefined,
    client: undefined,
    integrationId:
        (localStorage.getItem(StorageKey.WalletIntegrationId) as WalletIntegrationId) || undefined,
}

export const WalletAction = {
    setIntegrationId: createAction<WalletState['integrationId']>('wallet: set integration id'),

    setAccount: createAction<{ account: Address; provider: Provider } | undefined>(
        'wallet: set account'
    ),

    changeAccount: createAction<
        { account: Address; provider: Provider; streamrClient: StreamrClient } | undefined
    >('wallet: change account'),

    connect: createAction<WalletIntegrationId>('wallet: connect'),

    connectEagerly: createAction('wallet: connect eagerly'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(WalletAction.setIntegrationId, (state, { payload: integrationId }) => {
        state.integrationId = integrationId
    })

    builder.addCase(WalletAction.setAccount, SEE_SAGA)

    builder.addCase(WalletAction.changeAccount, (state, { payload }) => {
        Object.assign(state, {
            client: payload?.streamrClient,
            account: payload?.account,
            provider: payload?.provider,
        })
    })
})

export default reducer
