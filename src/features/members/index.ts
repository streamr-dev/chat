import { createReducer } from '@reduxjs/toolkit'
import { addMember, detectMembers, removeMember, setMembers } from './actions'
import { MembersState } from './types'

const initialState: MembersState = {
    items: {},
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(addMember, () => {
        // See `addMemberSaga`.
    })

    builder.addCase(removeMember, () => {
        // See `removeMemberSaga`.
    })

    builder.addCase(detectMembers, () => {
        // See `detectMembersSaga`.
    })

    builder.addCase(setMembers, (state, { payload: [roomId, members] }) => {
        state.items[roomId] = members
    })
})

export default reducer
