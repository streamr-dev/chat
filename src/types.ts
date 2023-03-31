import store from '$/store'

export enum StorageKey {
    WalletIntegrationId = 'chat/walletIntegrationId',
    EncryptedSession = 'chat/encrypted-session',
    RoomIds = 'chat/room-ids',
}

export type Address = string

export type OptionalAddress = undefined | null | Address

export interface IOwnable {
    owner: Address
}

export interface IFingerprinted {
    fingerprint: string
}

export interface IRecord extends IOwnable {
    createdAt?: number
    updatedAt?: number
}

export enum Prefix {
    Room = 'streamr-chat/room',
}

export enum PrivacySetting {
    Private = 'private',
    Public = 'public',
    TokenGated = 'tokenGated',
}

export interface PreflightParams {
    requester: Address
}

export type PrivacyOption = {
    value: PrivacySetting
}

export enum Fallback {
    RoomName = 'Unnamed room',
}

export type State = ReturnType<typeof store.getState>

export interface IAlias extends IRecord {
    address: string
    alias: string
}

export interface Erc20 {
    name: string
    symbol: string
    decimals: string
}

export interface Erc1155 {
    uris: Record<string, string>
}

export interface Erc721 {
    name: string
    symbol: string
    uris: Record<string, string>
}

export interface Erc777 {
    name: string
    symbol: string
    granularity: string
}

export type TokenMetadata = Erc1155 | Erc20 | Erc721 | Erc777
