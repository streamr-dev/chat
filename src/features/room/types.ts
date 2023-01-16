import { TokenGatedRoomState } from '$/features/tokenGatedRooms/types'
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

export interface IRoom extends IRecord, TokenGatedRoomState {
    createdBy?: string
    id: string
    name: string
    hidden?: boolean
    pinned?: boolean
    recentMessageAt?: number
}

export type RoomId = IRoom['id']
