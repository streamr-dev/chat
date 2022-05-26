import { createReducer } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import {
    createRoom,
    deleteRoom,
    renameRoom,
    selectRoom,
    setRecentRoomMessage,
} from './actions'
import { RoomsState } from './types'

const initialState: RoomsState = {
    ids: [],
    items: {},
    selectedId: undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(createRoom, (state, { payload }) => {
        const id = uuidv4()

        state.ids.push(id)

        state.items[id] = {
            ...payload,
            id,
        }

        state.selectedId = id
    })

    builder.addCase(renameRoom, (state, { payload: [id, newRoomName] }) => {
        if (!state.items[id]) {
            return
        }

        if (!newRoomName) {
            delete state.items[id].name
            return
        }

        state.items[id].name = newRoomName
    })

    builder.addCase(selectRoom, (state, { payload }) => {
        state.selectedId = payload
    })

    builder.addCase(
        setRecentRoomMessage,
        (state, { payload: [id, newRecentMessage] }) => {
            if (!state.items[id]) {
                return
            }

            if (!newRecentMessage) {
                delete state.items[id].recentMessage
                return
            }

            state.items[id].recentMessage = newRecentMessage
        }
    )

    builder.addCase(deleteRoom, (state, { payload }) => {
        state.ids = state.ids.filter((id) => id !== payload)

        delete state.items[payload]

        if (state.selectedId === payload) {
            state.selectedId =
                state.ids[Math.max(0, state.ids.indexOf(payload) - 1)]
        }
    })
})

export default reducer
