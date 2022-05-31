import { createReducer } from '@reduxjs/toolkit'
import { detectMembers, setLastSeenAt, setMemberPermissions, setMembers } from './actions'
import { MembersState } from './types'

const initialState: MembersState = {
    items: {},
    lastSeenAt: {},
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

    builder.addCase(setLastSeenAt, (state, { payload: { address, value } }) => {
        state.lastSeenAt[address.toLowerCase()] = value
    })
})

export default reducer
