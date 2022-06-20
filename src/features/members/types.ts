import { Address } from '$/types'
import { StreamPermission } from 'streamr-client'
import { RoomId } from '../room/types'

export interface IMember {
    address: Address
    permissions: StreamPermission[]
}

export interface MembersState {
    [index: RoomId]: IMember[]
}
