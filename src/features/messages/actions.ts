import { createAction } from '@reduxjs/toolkit'
import { RoomId } from '../rooms/types'
import { IMessage } from './types'

export enum MessageAction {
    PublishMessage = 'publish a message',
    RegisterMessage = 'register a message',
}

export const publishMessage = createAction<{
    roomId: RoomId
    content: string
}>(MessageAction.PublishMessage)

export const registerMessage = createAction<IMessage>(MessageAction.RegisterMessage)
