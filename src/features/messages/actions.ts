import { createAction } from '@reduxjs/toolkit'
import { IMessage } from './types'

export enum MessageAction {
    CreateMessage = 'create a message',
}

export const createMessage = createAction<IMessage>(MessageAction.CreateMessage)
