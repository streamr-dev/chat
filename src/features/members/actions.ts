import { createAction } from '@reduxjs/toolkit'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'

export enum MemberAction {
    AddMember = 'add a room member',
    RemoveMember = 'remove a room member',
    DetectMembers = 'detect room members',
    SetMembers = 'set room members',
}

export const addMember = createAction<[RoomId, Address]>(MemberAction.AddMember)

export const removeMember = createAction<[RoomId, Address]>(
    MemberAction.RemoveMember
)

export const detectMembers = createAction<RoomId>(MemberAction.DetectMembers)

export const setMembers = createAction<[RoomId, Address[]]>(
    MemberAction.SetMembers
)
