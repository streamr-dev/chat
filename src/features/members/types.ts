import { Address } from '$/types'
import { StreamPermission } from 'streamr-client'
import { RoomId } from '../room/types'

export interface IMember {
    address: Address
    permissions: StreamPermission[]
}

export interface MembersState {
    items: {
        [index: RoomId]: {
            members: IMember[]
            fetching: boolean
        }
    }
}
