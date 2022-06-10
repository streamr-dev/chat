import { createSelector } from '@reduxjs/toolkit'
import { StreamPermission } from 'streamr-client'
import { Address, OptionalAddress, State } from '$/types'
import { RoomId } from '../room/types'
import { PermissionState } from './types'

function selectSelf(state: State): PermissionState {
    return state.permission
}

export function selectAbility(
    roomId: undefined | RoomId,
    address: undefined | null | Address,
    permission: StreamPermission
): (state: State) => boolean {
    return createSelector(selectSelf, ({ items }) =>
        roomId && address
            ? Boolean(items[roomId]?.[address.toLowerCase()]?.permissions[permission]?.value)
            : false
    )
}

export function selectAbilityCache(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    return createSelector(selectSelf, ({ items }) =>
        roomId && address
            ? items[roomId]?.[address.toLowerCase()]?.permissions[permission]?.cache || 0
            : 0
    )
}

export function selectAbilityFetching(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    return createSelector(selectSelf, ({ items }) =>
        roomId && address
            ? Boolean(items[roomId]?.[address.toLowerCase()]?.permissions[permission]?.fetching)
            : false
    )
}

export function selectBulkFetching(roomId: undefined | RoomId, address: OptionalAddress) {
    return createSelector(selectSelf, ({ items }) =>
        roomId && address ? Boolean(items[roomId]?.[address.toLowerCase()]?.fetchingAll) : false
    )
}

export function selectPermissions(roomId: undefined | RoomId, address: OptionalAddress) {
    return createSelector(
        selectSelf,
        ({ items }) =>
            (roomId && address ? items[roomId]?.[address.toLowerCase()]?.permissions : undefined) ||
            {}
    )
}
