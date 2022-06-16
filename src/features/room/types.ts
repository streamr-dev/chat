import { Address, IRecord, PrivacySetting } from '$/types'

export interface RoomState {
    selectedId: undefined | RoomId
    privacy: {
        [index: RoomId]: {
            value: PrivacySetting
            changing: boolean
            getting: boolean
        }
    }
    storageNodes: {
        [index: RoomId]: {
            addresses: {
                [address: string]: {
                    state: boolean
                    toggling: boolean
                }
            }
            getting: boolean
        }
    }
    temporaryNames: {
        [index: RoomId]: {
            editing: boolean
            persisting: boolean
            name: string
        }
    }
    ongoingDeletion: {
        [roomId: RoomId]: true
    }
    ongoingPinning: {
        [owner: Address]: {
            [roomId: RoomId]: boolean
        }
    }
}

export interface IRoom extends IRecord {
    createdBy?: string
    id: string
    name: string
    hidden?: boolean
    pinned?: boolean
}

export type RoomId = IRoom['id']
