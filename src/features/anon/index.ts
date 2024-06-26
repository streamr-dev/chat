import { RoomId } from '$/features/room/types'
import getNewStreamrClient from '$/utils/getNewStreamrClient'
import { createAction, createReducer } from '@reduxjs/toolkit'
import type { Wallet } from 'ethers'
import StreamrClient from '@streamr/sdk'

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
            client: getNewStreamrClient({
                privateKey: wallet.privateKey,
            }),
            wallet,
        }
    })

    b.addCase(AnonAction.reset, (state) => {
        state.rooms = {}
    })
})

export default reducer
