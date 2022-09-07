import { Address } from '$/types'
import { AccountType } from '$/utils/getAccountType'
import { StreamPermission } from 'streamr-client'
import { RoomId } from '../room/types'

export interface IMember {
    address: Address
    permissions: StreamPermission[]
    accountType: AccountType.Main | AccountType.Unset
}

export interface MembersState {
    [index: RoomId]: IMember[]
}
