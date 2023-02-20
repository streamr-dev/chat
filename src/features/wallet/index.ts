import { createAction, createReducer } from '@reduxjs/toolkit'
import { OptionalAddress, StorageKey } from '$/types'
import { WalletIntegrationId, WalletState } from './types'
import StreamrClient from 'streamr-client'
import { all } from 'redux-saga/effects'
import setAccount from './sagas/setAccount.saga'
import setIntegrationId from './sagas/setIntegrationId.saga'
import connect from '$/features/wallet/sagas/connect.saga'
import { Provider } from '@web3-react/types'
import { SEE_SAGA } from '$/utils/consts'
import changeAccount from '$/features/wallet/sagas/changeAccount.saga'

const initialState: WalletState = {
    account: undefined,
    provider: undefined,
    client: undefined,
    integrationId:
        (localStorage.getItem(StorageKey.WalletIntegrationId) as WalletIntegrationId) || undefined,
}

export const WalletAction = {
    setIntegrationId: createAction<WalletState['integrationId']>('wallet: set integration id'),

    setAccount: createAction<{ account: OptionalAddress; provider?: undefined | Provider }>(
        'wallet: set account'
    ),

    changeAccount: createAction<{ account: OptionalAddress; provider?: undefined | Provider }>(
        'wallet: change account'
    ),

    connect: createAction<{ integrationId: WalletIntegrationId; eager: boolean }>(
        'wallet: connect'
    ),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(WalletAction.setIntegrationId, (state, { payload: integrationId }) => {
        state.integrationId = integrationId
    })

    builder.addCase(WalletAction.setAccount, SEE_SAGA)

    builder.addCase(WalletAction.changeAccount, (state, { payload: { account, provider } }) => {
        state.account = account

        state.provider = provider

        state.client = provider
            ? new StreamrClient({
                  auth: {
                      ethereum: provider,
                  },
                  encryption: {
                      litProtocolEnabled: true,
                      litProtocolLogging: false,
                  },
                  gapFill: false,
              })
            : undefined
    })
})

export function* walletSaga() {
    yield all([setAccount(), setIntegrationId(), connect(), changeAccount()])
}

export default reducer
