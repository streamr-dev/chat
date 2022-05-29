import { createAction } from '@reduxjs/toolkit'
import { IMessage } from './types'

export enum MessageAction {
    CreateMessage = 'create a message',
}

// HERE
// 1. Rename createMessage to something more like `registerMessage` cause we're gonna show the message
// once it actually arrives back (publish -> intercept).
// 2. Add `publishMessage` which is the actual publishing.
// 3. Sort messages by their createdAt instead of the arrival shit.

export const createMessage = createAction<IMessage>(MessageAction.CreateMessage)
