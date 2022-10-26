import { HexSerializedBigNumber, TokenType } from '$/features/tokenGatedRooms/types'
import { Address, IRecord, PrivacySetting } from '$/types'

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
    recentMessageAt?: number
    // for token-gated rooms
    tokenAddress?: Address
    tokenId?: HexSerializedBigNumber
    minTokenAmount?: HexSerializedBigNumber
    tokenType?: TokenType
}

export type RoomId = IRoom['id']
