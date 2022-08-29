import { MessageState } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import { OptionalAddress, State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'

function selectSelf(state: State): MessageState {
    return state.message
}

export function selectFromTimestamp(
    roomId: undefined | RoomId,
    requester: OptionalAddress
): (state: State) => undefined | number {
    if (!roomId || !requester) {
        return () => undefined
    }

    return createSelector(
        selectSelf,
        (substate) => substate[requester.toLowerCase()]?.[roomId]?.from
    )
}
