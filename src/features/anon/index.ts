import { RoomId } from '$/features/room/types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import type { Wallet } from 'ethers'
import StreamrClient from 'streamr-client'

type AnonState = {
    rooms: Partial<
        Record<
            RoomId,
            {
                client: StreamrClient
                wallet: Wallet
            }
        >
    >
}

const initialState: AnonState = {
    rooms: {},
}

export const AnonAction = {
    setWallet: createAction<{ roomId: RoomId; wallet: Wallet }>('anon: set wallet'),

    reset: createAction('anon: reset'),
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(AnonAction.setWallet, (state, { payload: { roomId, wallet } }) => {
        if (state.rooms[roomId]) {
            // Don't overwrite!
            return
        }

        state.rooms[roomId] = {
            client: new StreamrClient({
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
            }),
            wallet,
        }
    })

    b.addCase(AnonAction.reset, (state) => {
        state.rooms = {}
    })
})

export default reducer
