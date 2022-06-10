import { RoomId } from '$/features/room/types'
import { Address } from '$/types'

export interface MemberState {
    notices: {
        [address: Address]: number
    }
    ongoingRemoval: {
        [roomId: RoomId]: {
            [address: Address]: true
        }
    }
    ongoingAddition: {
        [roomId: RoomId]: {
            [address: Address]: true
        }
    }
}
