import { MetaMaskInpageProvider } from '@metamask/providers'
import { Wallet } from 'ethers'
import { StreamrClient, Stream } from 'streamr-client'

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
    account: string | undefined
    drafts: any
    ethereumProvider: MetaMaskInpageProvider | undefined
    ethereumProviderReady: boolean
    identity?: string
    messages: MessagesCollection
    roomId?: string
    roomIds: string[] | undefined
    roomNameEditable: boolean
    rooms: ChatRoom[]
    session: StreamrSession
}

export enum MessageType {
    TEXT = 'text',
    METADATA = 'metadata',
}
export interface ChatMessage {
    type: MessageType
    payload: string
}

export interface StreamrSession {
    wallet: Wallet | undefined
    streamrClient: StreamrClient | undefined
}

export interface ChatRoom {
    id: string
    name: string
    stream: Stream
    publishMessage: (message: string) => Promise<void>
    publishMetadata: (metadata: any) => Promise<void>
    subscribeMessages: (callback: (message: ChatMessage) => void) => void
    subscribeMetadata: (callback: (metadata: any) => void) => void
}

export enum StorageKey {
    EncryptedSession = 'chat/encrypted-session',
    RoomIds = 'chat/room-ids',
}