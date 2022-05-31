import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'

export interface MembersState {
    items: {
        [index: RoomId]: string[]
    }
}

export enum MemberAction {
    AddMember = 'add a room member',
    RemoveMember = 'remove a room member',
    DetectMembers = 'detect room members',
    SetMembers = 'set room members',
    SetMemberPermissions = 'set member permissions',
}
