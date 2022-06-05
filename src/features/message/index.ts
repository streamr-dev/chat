import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '../../utils/consts'
import { RoomId } from '../room/types'
import emitPresence from './sagas/emitPresence.saga'
import publish from './sagas/publish.saga'
import register from './sagas/register.saga'
import { IMessage, MessageType } from './types'

interface PublishParams {
    roomId: RoomId
    content: string
    type: MessageType
}

interface RegisterParams {
    type: MessageType
    message: Omit<IMessage, 'owner'>
}

export const MessageAction = {
    publish: createAction<PublishParams>('message: publish'),
    emitPresence: createAction<RoomId>('message: emit presence'),
    register: createAction<RegisterParams>('message: register'),
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(MessageAction.publish, SEE_SAGA)

    builder.addCase(MessageAction.register, SEE_SAGA)

    builder.addCase(MessageAction.emitPresence, SEE_SAGA)
})

export function* messageSaga() {
    yield all([emitPresence(), publish(), register()])
}

export default reducer
