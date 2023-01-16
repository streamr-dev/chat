import { TokenGatedRoomState } from '$/features/tokenGatedRooms/types'
import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'

function selectSelf(state: State): TokenGatedRoomState {
    return state.tokenGatedRooms
}

export function selectTokenMetadata() {
    return createSelector(selectSelf, (substate) => substate.tokenMetadata)
}
