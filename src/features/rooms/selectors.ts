import { createSelector } from '@reduxjs/toolkit'
import { RoomsState } from './types'

function selectSelf(state: any): RoomsState {
    return state.rooms
}

export const selectSelectedRoomId = createSelector(
    selectSelf,
    ({ selectedId }) => selectedId
)
