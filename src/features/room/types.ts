import { IRecord, PrivacySetting } from '$/types'

export interface RoomState {
    selectedRoomId?: RoomId
    cache: {
        [roomId: RoomId]: {
            privacy?: PrivacySetting
            storageNodes: {
                [address: string]: boolean
            }
            temporaryName?: string
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
