import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import publish from './sagas/publish.saga'
import register from './sagas/register.saga'
import { IMessage } from './types'
import StreamrClient from 'streamr-client'
import { Address } from '$/types'

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
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(MessageAction.publish, SEE_SAGA)

    builder.addCase(MessageAction.register, SEE_SAGA)
})

export function* messageSaga() {
    yield all([publish(), register()])
}

export default reducer
