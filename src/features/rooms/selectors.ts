import { createSelector } from '@reduxjs/toolkit'
import { RoomId, RoomsState } from './types'

function selectSelf(state: any): RoomsState {
    return state.rooms
}

export const selectRoomIds = createSelector(selectSelf, ({ ids }) => ids)

const selectItems = createSelector(selectSelf, ({ items }) => items)

export const selectSelectedRoomId = createSelector(
    selectSelf,
    ({ selectedId }) => selectedId
)

export function selectRoom(id: RoomId): any {
    return createSelector(selectItems, (items) => items[id])
}

export function selectRoomName(id: RoomId) {
    return createSelector(selectRoom(id), ({ name } = {}) => name)
}

export function selectRoomRecentMessage(id: RoomId) {
    return createSelector(
        selectRoom(id),
        ({ recentMessage } = {}) => recentMessage
    )
}
