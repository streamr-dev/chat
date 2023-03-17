import { createReducer } from '@reduxjs/toolkit'
import { DelegationState } from './types'
import { createAction } from '@reduxjs/toolkit'
import { Address, IFingerprinted, IOwnable, OptionalAddress } from '$/types'
import getNewStreamrClient from '$/utils/getNewStreamrClient'

const initialState: DelegationState = {
    privateKey: undefined,
    client: undefined,
    delegations: {},
}

export const DelegationAction = {
    setPrivateKey: createAction<string | undefined>('delegation: set delegated private key'),

    requestPrivateKey: createAction<IOwnable & IFingerprinted>('delegation: request private key'),

    lookup: createAction<
        IFingerprinted & {
            delegated: Address
            checkNetwork?: boolean
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
            ? getNewStreamrClient({
                  privateKey,
              })
            : undefined
    })

    builder.addCase(DelegationAction.setDelegation, (state, { payload: { main, delegated } }) => {
        if (typeof main === 'undefined') {
            delete state.delegations[delegated.toLowerCase()]

            return
        }

        state.delegations[delegated.toLowerCase()] = main ? main.toLowerCase() : null
    })
})

export default reducer
