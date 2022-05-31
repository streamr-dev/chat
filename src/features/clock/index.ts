import { createReducer } from '@reduxjs/toolkit'
import { tick } from './actions'
import { ClockState } from './types'

const initialState: ClockState = {
    tickedAt: undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(tick, (state, { payload: tickedAd }) => {
        state.tickedAt = tickedAd
    })
})

export default reducer
