import { createAction } from '@reduxjs/toolkit'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'

export enum MemberAction {
    AddMember = 'add a room member',
    RemoveMember = 'remove a room member',
    DetectMembers = 'detect room members',
    SetMembers = 'set room members',
    SetMemberPermissions = 'set member permissions',
}

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
