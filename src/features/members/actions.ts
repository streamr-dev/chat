import { createAction } from '@reduxjs/toolkit'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'

export enum MemberAction {
    AddMember = 'add a room member',
    RemoveMember = 'remove a room member',
    DetectMembers = 'detect room members',
    SetMembers = 'set room members',
}

export const addMember = createAction<{
    roomId: RoomId
    address: Address
}>(MemberAction.AddMember)

export const removeMember = createAction<{
    roomId: RoomId
    address: Address
}>(MemberAction.RemoveMember)

export const detectMembers = createAction<RoomId>(MemberAction.DetectMembers)

export const setMembers = createAction<{
    roomId: RoomId
    addresses: Address[]
}>(MemberAction.SetMembers)
