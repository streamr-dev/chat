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

export type ExtendedStream = Stream & {
    extensions?: {
        'thechat.eth'?: Omit<IRoom, 'id' | 'name'>
    }
}
