import { createReducer } from '@reduxjs/toolkit'
import { detectMembers, setMemberPermissions, setMembers } from './actions'
import { MembersState } from './types'

const initialState: MembersState = {
    items: {},
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(detectMembers, () => {
        // See `detectMembersSaga`.
    })

    builder.addCase(setMembers, (state, { payload: { roomId, addresses } }) => {
        state.items[roomId] = addresses
    })

    builder.addCase(setMemberPermissions, () => {
        // See `setMemberPermissionsSaga`.
    })
})

export default reducer
