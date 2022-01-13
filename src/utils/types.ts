import StreamrClient from 'streamr-client'
import { ChatRoom } from '../lib/ChatRoom'

export type MessagePayload = {
    body: string
    createdAt: number
    sender: string
    id: string
}

export type MessagesCollection = {
    [index: string]: Array<MessagePayload>
}

export type DraftCollection = {
    [index: string]: string
}

export type ChatState = {
    drafts: any
    identity?: string
    messages: MessagesCollection
    roomId?: string
    roomNameEditable: boolean
    rooms: ChatRoom[]
    metamaskAddress: string
    sessionAddress: string
    streamrClient: StreamrClient | undefined
}
