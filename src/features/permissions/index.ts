import { createReducer } from '@reduxjs/toolkit'
import { fetchPermission, setLocalPermission } from './actions'
import { PermissionsState } from './types'

const initialState: PermissionsState = {
    items: {},
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(fetchPermission, () => {
        // See `fetchPermissionSaga`.
    })

    builder.addCase(
        setLocalPermission,
        (state, { payload: { roomId, address, permission, value } }) => {
            if (!state.items[roomId]) {
                state.items[roomId] = {}
            }

            if (!state.items[roomId][address]) {
                state.items[roomId][address] = {}
            }

            state.items[roomId][address][permission] = value
        }
    )
})

export default reducer
