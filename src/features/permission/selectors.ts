import { createSelector } from '@reduxjs/toolkit'
import { StreamPermission } from 'streamr-client'
import { Address, OptionalAddress, State } from '$/types'
import { RoomId } from '../room/types'
import { PermissionState } from './types'
import { selectFlag } from '$/features/flag/selectors'
import { Flag } from '$/features/flag/types'

function selectSelf(state: State): PermissionState {
    return state.permission
}

export function selectAbility(
    roomId: undefined | RoomId,
    address: undefined | null | Address,
    permission: StreamPermission
): (state: State) => boolean {
    return createSelector(selectSelf, (substate) =>
        roomId && address
            ? Boolean(substate[roomId]?.[address.toLowerCase()]?.[permission]?.value)
            : false
    )
}

export function selectPermissionCache(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    return createSelector(selectSelf, (substate) =>
        roomId && address ? substate[roomId]?.[address.toLowerCase()]?.[permission]?.cache || 0 : 0
    )
}

export function selectIsFetchingPermission(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    if (!roomId || !address) {
        return () => false
    }

    return selectFlag(Flag.isPermissionBeingFetched(roomId, address, permission))
}

export function selectIsFetchingAll(roomId: undefined | RoomId, address: OptionalAddress) {
    if (!roomId || !address) {
        return () => false
    }

    return selectFlag(Flag.isFetchingAllPermissions(roomId, address))
}

export function selectPermissions(roomId: undefined | RoomId, address: OptionalAddress) {
    return createSelector(
        selectSelf,
        (substate) =>
            (roomId && address ? substate[roomId]?.[address.toLowerCase()] : undefined) || {}
    )
}
