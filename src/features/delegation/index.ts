import { createReducer } from '@reduxjs/toolkit'
import StreamrClient from 'streamr-client'
import { SEE_SAGA } from '$/utils/consts'
import { DelegationState } from './types'
import { createAction } from '@reduxjs/toolkit'
import { Provider } from '@web3-react/types'
import { Address, IFingerprinted, IOwnable } from '$/types'

const initialState: DelegationState = {
    privateKey: undefined,
    client: undefined,
    delegations: {},
}

export const DelegationAction = {
    setPrivateKey: createAction<string | undefined>('delegation: set delegated private key'),

    requestPrivateKey: createAction<IOwnable & IFingerprinted & { provider: Provider }>(
        'delegation: request private key'
    ),

    lookup: createAction<
        IFingerprinted & {
            delegated: Address
            provider: Provider
        }
    >('delegation: lookup'),

    setDelegation: createAction<{ main: Address; delegated: Address }>(
        'delegation: set delegation'
    ),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(DelegationAction.setPrivateKey, (state, { payload: privateKey }) => {
        state.privateKey = privateKey || undefined

        state.client = privateKey
            ? new StreamrClient({
                  auth: {
                      privateKey,
                  },
                  gapFill: false,
                  encryption: {
                      litProtocolEnabled: true,
                      litProtocolLogging: false,
                  },
                  decryption: {
                      keyRequestTimeout: 2500,
                  },
              })
            : undefined
    })

    builder.addCase(DelegationAction.requestPrivateKey, SEE_SAGA)

    builder.addCase(DelegationAction.lookup, SEE_SAGA)

    builder.addCase(DelegationAction.setDelegation, (state, { payload: { main, delegated } }) => {
        state.delegations[delegated.toLowerCase()] = main.toLowerCase()
    })
})

export default reducer
