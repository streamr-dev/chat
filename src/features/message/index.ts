import { createAction, createReducer } from '@reduxjs/toolkit'
import { RoomId } from '../room/types'
import { IMessage, MessageState } from './types'
import StreamrClient from 'streamr-client'
import { Address, IFingerprinted } from '$/types'

export const MessageAction = {
    publish: createAction<{
        roomId: RoomId
        content: string
        streamrClient: StreamrClient
    }>('message: publish'),

    register: createAction<{
        message: Omit<IMessage, 'owner'>
        owner: Address
    }>('message: register'),

    updateSeenAt: createAction<
        IFingerprinted & {
            roomId: RoomId
            requester: Address
            id: IMessage['id']
            seenAt: number
        }
    >('message: update seenAt'),

    resend: createAction<
        IFingerprinted & {
            roomId: RoomId
            requester: Address
            streamrClient: StreamrClient
            timestamp?: number
            exact?: boolean
        }
    >('message: resend'),

    setFromTimestamp: createAction<{ roomId: RoomId; requester: Address; timestamp: number }>(
        'message: set "from" timestamp'
    ),
}

const initialState: MessageState = {}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(
        MessageAction.setFromTimestamp,
        (state, { payload: { roomId, requester, timestamp } }) => {
            const addr = requester.toLowerCase()

            if (!state[addr]) {
                state[addr] = {}
            }

            if (!state[addr][roomId]) {
                state[addr][roomId] = {
                    from: undefined,
                }
            }

            const obj = state[addr][roomId]

            if (
                typeof obj.from === 'undefined' ||
                typeof timestamp === 'undefined' ||
                obj.from > timestamp
            ) {
                state[addr][roomId].from = timestamp
            }
        }
    )
})

export default reducer
