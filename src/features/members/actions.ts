import { createAction } from '@reduxjs/toolkit'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'

export enum MemberAction {
    AddMember = 'add a room member',
    RemoveMember = 'remove a room member',
    DetectMembers = 'detect room members',
    SetMembers = 'set room members',
}

interface ItemPayload {
    roomId: RoomId
    address: Address
}

interface CollectionPayload {
    roomId: RoomId
    addresses: Address[]
}

export const addMember = createAction<ItemPayload>(MemberAction.AddMember)

export const removeMember = createAction<ItemPayload>(MemberAction.RemoveMember)

export const detectMembers = createAction<RoomId>(MemberAction.DetectMembers)

export const setMembers = createAction<CollectionPayload>(MemberAction.SetMembers)
