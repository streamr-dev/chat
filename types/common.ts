import { Stream } from 'streamr-client'
import { IRoom } from '../src/features/rooms/types'

export enum StorageKey {
    WalletIntegrationId = 'chat/walletIntegrationId',
    EncryptedSession = 'chat/encrypted-session',
    RoomIds = 'chat/room-ids',
}

export interface IRecord {
    owner: string
    createdAt?: number
    updatedAt?: number
}

export enum Prefix {
    Room = 'streamr-chat/room',
}

export enum PrivacySetting {
    Private = 'private',
    ViewOnly = 'viewOnly',
    Public = 'public',
}

export type RoomMetadata = Omit<IRoom, 'id' | 'name' | 'owner'>

export type UnsafeStream = Stream & {
    extensions?: {
        'thechat.eth'?: RoomMetadata
    }
}

export type EnhancedStream = Stream & {
    extensions: {
        'thechat.eth': RoomMetadata
    }
}

export type Address = string

export type OptionalAddress = undefined | null | Address
