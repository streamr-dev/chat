import GatedIcon from '$/icons/GatedIcon'
import store from '$/store'
import { Provider } from '@web3-react/types'
import { ReactNode } from 'react'
import PrivateIcon from '../src/icons/PrivateIcon'
import PublicIcon from '../src/icons/PublicIcon'

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
    provider: Provider
    requester: Address
}

export type PrivacyOption = {
    value: PrivacySetting
    label: string
    desc: ReactNode
    icon: typeof PrivateIcon | typeof PublicIcon | typeof GatedIcon
    disabled?: boolean
}

export enum Fallback {
    RoomName = 'Unnamed room',
}

export type State = ReturnType<typeof store.getState>
