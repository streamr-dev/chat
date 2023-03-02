import { createReducer } from '@reduxjs/toolkit'
import StreamrClient from 'streamr-client'
import { SEE_SAGA } from '$/utils/consts'
import { DelegationState } from './types'
import { createAction } from '@reduxjs/toolkit'
import { Provider } from '@web3-react/types'
import { Address, IFingerprinted, IOwnable, OptionalAddress } from '$/types'

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

    setDelegation: createAction<{ main: OptionalAddress; delegated: Address }>(
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
              })
            : undefined
    })

    builder.addCase(DelegationAction.requestPrivateKey, SEE_SAGA)

    builder.addCase(DelegationAction.lookup, SEE_SAGA)

    builder.addCase(DelegationAction.setDelegation, (state, { payload: { main, delegated } }) => {
        if (typeof main === 'undefined') {
            delete state.delegations[delegated.toLowerCase()]

            return
        }

        state.delegations[delegated.toLowerCase()] = main ? main.toLowerCase() : null
    })
})

export default reducer
