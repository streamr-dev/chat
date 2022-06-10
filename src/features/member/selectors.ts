import { createSelector } from '@reduxjs/toolkit'
import { OptionalAddress, State } from '$/types'
import { MemberState } from './types'
import { RoomId } from '$/features/room/types'

function selectSelf(state: State): MemberState {
    return state.member
}

export function selectNoticedAt(address: OptionalAddress): (state: State) => undefined | number {
    return createSelector(selectSelf, ({ notices }) =>
        address ? notices[address.toLowerCase()] : undefined
    )
}

export function selectIsBeingRemoved(roomId: undefined | RoomId, address: OptionalAddress) {
    return createSelector(selectSelf, ({ ongoingRemoval }) =>
        roomId && address ? Boolean(ongoingRemoval[roomId]?.[address.toLowerCase()]) : false
    )
}

export function selectIsBeingAdded(roomId: undefined | RoomId, address: OptionalAddress) {
    return createSelector(selectSelf, ({ ongoingAddition }) =>
        roomId && address ? Boolean(ongoingAddition[roomId]?.[address.toLowerCase().trim()]) : false
    )
}
