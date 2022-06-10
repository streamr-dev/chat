import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'
import { RoomId } from '../room/types'
import { IMember, MembersState } from './types'

function selectSelf(state: State): MembersState {
    return state.members
}

export function selectMembers(roomId: undefined | RoomId): (state: State) => IMember[] {
    return createSelector(
        selectSelf,
        ({ items }) => (roomId ? items[roomId]?.members : undefined) || []
    )
}

export function selectFetching(roomId: undefined | RoomId): (state: State) => boolean {
    return createSelector(selectSelf, ({ items }) =>
        roomId ? Boolean(items[roomId]?.fetching) : false
    )
}
