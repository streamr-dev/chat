import { createAction, createReducer } from '@reduxjs/toolkit'
import type { Wallet } from 'ethers'
import StreamrClient from 'streamr-client'

interface AnonState {
    client?: StreamrClient
    wallet?: Wallet
}

const initialState: AnonState = {}

export const AnonAction = {
    setWallet: createAction<{ wallet: AnonState['wallet'] }>('anon: set wallet'),
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(AnonAction.setWallet, (state, { payload: { wallet } }) => {
        if (!wallet) {
            delete state.wallet

            delete state.client

            return
        }

        state.client = new StreamrClient({
            auth: {
                privateKey: wallet.privateKey,
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

        state.wallet = wallet
    })
})

export default reducer
