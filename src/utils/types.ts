import { MetaMaskInpageProvider } from '@metamask/providers'
import { Wallet } from 'ethers'
import { StreamrClient } from 'streamr-client'

export type RoomId = string

export type MessagePayload = {
    body: string
    createdAt: number
    id: string
    sender: string
    version: number
}

export type ChatState = {
    account: string | undefined
    drafts: { [index: RoomId]: string }
    ethereumProvider: MetaMaskInpageProvider | undefined
    metamaskStreamrClient: StreamrClient | undefined
    ethereumProviderReady: boolean
    identity?: string
    messages: MessagePayload[]
    recentMessages: { [index: RoomId]: string }
    roomId?: RoomId
    roomIds: RoomId[] | undefined
    roomNameEditable: boolean
    roomNames: { [index: RoomId]: string }
    session: StreamrSession
}

export enum MessageType {
    Text = 'text',
    Metadata = 'metadata',
}
export interface ChatMessage {
    type: MessageType
    payload: string
}

export interface StreamrSession {
    wallet: Wallet | undefined
    streamrClient: StreamrClient | undefined
}

export enum StorageKey {
    EncryptedSession = 'chat/encrypted-session',
    RoomIds = 'chat/room-ids',
}

export enum Partition {
    Messages,
    Metadata,
}
