import { FlagState } from '$/features/flag/types'
import { Address, IOwnable } from '$/types'
import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState: FlagState = {}

export const FlagAction = {
    set: createAction<IOwnable & { key: string }>('flag: set'),
    unset: createAction<IOwnable & { key: string }>('flag: unset'),
}

function flag(state: FlagState, owner: Address) {
    if (!state[owner]) {
        state[owner] = {}
    }

    return state[owner]
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(FlagAction.set, (state, { payload: { owner, key } }) => {
        flag(state, owner)[key] = true
    })

    builder.addCase(FlagAction.unset, (state, { payload: { owner, key } }) => {
        delete flag(state, owner)[key]
    })
})

export default reducer
