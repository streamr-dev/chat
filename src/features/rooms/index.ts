import { createReducer } from '@reduxjs/toolkit'
import { createRoom, deleteRoom, renameRoom, selectRoom } from './actions'
import { RoomsState } from './types'

const initialState: RoomsState = {
    selectedId: undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(createRoom, () => {
        // See `createRoomSaga`.
    })

    builder.addCase(renameRoom, () => {
        // See `renameRoomSaga`.
    })

    builder.addCase(selectRoom, (state, { payload }) => {
        state.selectedId = payload
    })

    builder.addCase(deleteRoom, () => {
        // See `deleteRoomSaga`.
    })
})

export default reducer
