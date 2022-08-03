import { Address } from '$/types'
import { StreamPermission } from 'streamr-client'
import { RoomId } from '../room/types'

export interface IMember {
    address: Address
    permissions: StreamPermission[]
    isMainAccount: boolean
    isDelegatedAccount: boolean
}

export interface MembersState {
    [index: RoomId]: IMember[]
}
