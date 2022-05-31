import { createAction } from '@reduxjs/toolkit'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'
import { MemberAction } from './types'

export const detectMembers = createAction<RoomId>(MemberAction.DetectMembers)

export const setMembers = createAction<{
    roomId: RoomId
    addresses: Address[]
}>(MemberAction.SetMembers)

export const setMemberPermissions = createAction<{
    roomId: RoomId
    address: Address
    permissions: StreamPermission[]
}>(MemberAction.SetMemberPermissions)

export const setLastSeenAt = createAction<{ address: Address; value: number }>(
    MemberAction.SetLastSeenAt
)
