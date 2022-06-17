import { FlagState } from '$/features/flag/types'
import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState: FlagState = {}

export const FlagAction = {
    set: createAction<string>('flag: set'),
    unset: createAction<string>('flag: unset'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(FlagAction.set, (state, { payload }) => {
        state[payload] = true
    })

    builder.addCase(FlagAction.unset, (state, { payload }) => {
        delete state[payload]
    })
})

export default reducer
