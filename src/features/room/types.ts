import { TokenGate } from '$/features/tokenGatedRooms/types'
import { Address, IRecord, OptionalAddress, PrivacySetting } from '$/types'

export interface RoomState {
    selectedRoomId?: RoomId
    cache: Partial<
        Record<
            RoomId,
            {
                privacy?: PrivacySetting
                storageNodes: Record<Address, boolean>
                temporaryName?: string
                tokenGate?: CachedTokenGate | null
            }
        >
    >
    searchResults: Partial<
        Record<
            RoomId,
            null | {
                name: string
                tokenAddress: OptionalAddress
            }
        >
    >
}

export interface IRoom extends IRecord, TokenGate {
    createdBy?: string
    id: string
    name: string
    hidden?: boolean
    pinned?: boolean
    recentMessageAt?: number
}

export type RoomId = IRoom['id']

export type CachedTokenGate = Required<
    Pick<TokenGate, 'tokenAddress' | 'tokenIds' | 'minRequiredBalance'>
>
