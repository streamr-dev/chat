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
                /**
                 * `tokenGate` is:
                 * - null if the room isn't token gated,
                 * - an object if it is, and
                 * - undefined if we don't know if it is.
                 */
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
    recentRoomId: RoomId | undefined
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
    Pick<TokenGate, 'tokenAddress' | 'tokenIds' | 'minRequiredBalance' | 'stakingEnabled'>
>
