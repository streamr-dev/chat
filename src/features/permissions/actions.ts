import { createAction } from '@reduxjs/toolkit'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'

export enum PermissionAction {
    FetchPermission = 'fetch permission',
    SetLocalPermission = 'set local permission',
    InvalidatePermissions = 'invalidate permissions',
}

export const fetchPermission = createAction<{
    roomId: RoomId
    address: Address
    permission: StreamPermission
}>(PermissionAction.FetchPermission)

export const setLocalPermission = createAction<{
    roomId: RoomId
    address: Address
    permission: StreamPermission
    value: boolean
}>(PermissionAction.SetLocalPermission)

export const invalidatePermissions = createAction<{
    roomId: RoomId
    address: Address
}>(PermissionAction.InvalidatePermissions)
