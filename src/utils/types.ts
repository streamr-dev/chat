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
    type: MessageType
}

export enum RoomPrivacy {
    Private = 'private',
    ViewOnly = 'viewonly',
    Public = 'public',
}
export type RoomMetadata = {
    name: string
    createdAt: number
    privacy: RoomPrivacy
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
    roomMembers: { [index: string]: string[] }
}

export enum MessageType {
    Text = 'text',
    Metadata = 'metadata',
}

export interface StreamrSession {
    wallet: Wallet | undefined
    streamrClient: StreamrClient | undefined
}

export enum StorageKey {
    EncryptedSession = 'chat/encrypted-session',
    RoomIds = 'chat/room-ids',
}

export enum MetadataType {
    SendInvite = 'send-invite',
    AcceptInvite = 'accept-invite',
    RevokeInvite = 'revoke-invite',
}
