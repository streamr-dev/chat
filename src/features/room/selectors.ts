import { createSelector } from '@reduxjs/toolkit'
import { RoomState } from './types'

function selectSelf(state: any): RoomState {
    return state.room
}

export const selectSelectedRoomId = createSelector(selectSelf, ({ selectedId }) => selectedId)
