import { createSelector } from '@reduxjs/toolkit'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'
import { PermissionsState } from './types'

function selectSelf(state: any): PermissionsState {
    return state.permissions
}

export function selectAbility(
    roomId: undefined | RoomId,
    address: undefined | null | Address,
    permission: StreamPermission
): (state: any) => boolean {
    return createSelector(selectSelf, ({ items }) =>
        roomId && address
            ? Boolean(items[roomId]?.[address]?.[permission])
            : false
    )
}
