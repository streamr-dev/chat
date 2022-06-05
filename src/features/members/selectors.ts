import { createSelector } from '@reduxjs/toolkit'
import { RoomId } from '../room/types'
import { MembersState } from './types'

function selectSelf(state: any): MembersState {
    return state.members
}

export function selectMembers(roomId: undefined | RoomId): (state: any) => string[] {
    return createSelector(selectSelf, ({ items }) => (roomId ? items[roomId] : undefined) || [])
}
