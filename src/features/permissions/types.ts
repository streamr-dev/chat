import type { RoomId } from '$/features/room/types'
import type { Address } from '$/types'
import { AccountType } from '$/utils/getAccountType'
import type { StreamPermission } from '@streamr/sdk'

export interface IMember {
    address: Address
    permissions: StreamPermission[]
    accountType: AccountType.Main | AccountType.Unset
}

export interface PermissionsState {
    roomMembers: Record<RoomId, IMember[]>

    permissions: Record<
        RoomId,
        Record<
            Address,
            Record<
                string,
                {
                    cache?: number
                    value?: boolean
                }
            >
        >
    >
}
