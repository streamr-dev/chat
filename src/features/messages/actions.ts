import { createAction } from '@reduxjs/toolkit'
import { RoomId } from '../rooms/types'
import { IMessage, MessageType } from './types'

export enum MessageAction {
    PublishMessage = 'publish a message',
    EmitPresence = 'emit presence',
    RegisterMessage = 'register a message',
}

export const publishMessage = createAction<{
    roomId: RoomId
    content: string
    type: MessageType
}>(MessageAction.PublishMessage)

export const registerMessage = createAction<{
    type: MessageType
    message: Omit<IMessage, 'owner'>
}>(MessageAction.RegisterMessage)

export const emitPresence = createAction<RoomId>(MessageAction.EmitPresence)
