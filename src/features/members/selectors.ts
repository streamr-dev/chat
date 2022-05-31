import { createSelector } from '@reduxjs/toolkit'
import { OptionalAddress } from '../../../types/common'
import { RoomId } from '../rooms/types'
import { MembersState } from './types'

function selectSelf(state: any): MembersState {
    return state.members
}

export function selectMembers(roomId: undefined | RoomId): (state: any) => string[] {
    return createSelector(selectSelf, ({ items }) => (roomId ? items[roomId] : undefined) || [])
}

export function selectLastSeenAt(address: OptionalAddress): (state: any) => undefined | number {
    return createSelector(selectSelf, ({ lastSeenAt }) =>
        address ? lastSeenAt[address.toLowerCase()] : undefined
    )
}
