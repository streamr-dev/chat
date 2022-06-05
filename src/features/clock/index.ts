import { createReducer } from '@reduxjs/toolkit'
import { ClockAction } from './actions'
import { ClockState } from './types'

const initialState: ClockState = {
    tickedAt: undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(ClockAction.Tick, (state, { payload: tickedAd }) => {
        state.tickedAt = tickedAd
    })
})

export default reducer
