import { createAction, createReducer } from '@reduxjs/toolkit'
import { ClockState } from './types'

const initialState: ClockState = {
    tickedAt: undefined,
    startedAt: undefined,
}

export const ClockAction = {
    tick: createAction<number>('clock: tick'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(ClockAction.tick, (state, { payload: tickedAd }) => {
        state.tickedAt = tickedAd

        if (typeof state.startedAt === 'undefined') {
            state.startedAt = tickedAd
        }
    })
})

export default reducer
