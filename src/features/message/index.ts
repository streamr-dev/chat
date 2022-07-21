import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import publish from './sagas/publish.saga'
import register from './sagas/register.saga'
import { IMessage } from './types'
import StreamrClient from 'streamr-client'
import { Address, IFingerprinted } from '$/types'
import updateSeenAt from '$/features/message/sagas/updateSeenAt.saga'

export const MessageAction = {
    publish: createAction<{
        roomId: RoomId
        content: string
        requester: Address
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

    resend: createAction<{
        roomId: RoomId
        requester: Address
        streamrClient: StreamrClient
    }>('message: resend'),
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(MessageAction.publish, SEE_SAGA)

    builder.addCase(MessageAction.register, SEE_SAGA)

    builder.addCase(MessageAction.updateSeenAt, SEE_SAGA)

    builder.addCase(MessageAction.resend, SEE_SAGA)
})

export function* messageSaga() {
    yield all([publish(), register(), updateSeenAt()])
}

export default reducer
