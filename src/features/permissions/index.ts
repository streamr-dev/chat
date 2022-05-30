import { createReducer } from '@reduxjs/toolkit'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'
import { fetchPermission, invalidatePermissions, setLocalPermission } from './actions'
import { PermissionsState } from './types'

const initialState: PermissionsState = {
    items: {},
}

interface BuildItemParams {
    roomId: RoomId
    address: Address
}

function getItem(state: PermissionsState, { roomId, address }: BuildItemParams) {
    if (!state.items[roomId]) {
        state.items[roomId] = {}
    }

    if (!state.items[roomId][address]) {
        state.items[roomId][address] = {}
    }

    return state.items[roomId][address]
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(fetchPermission, () => {
        // See `fetchPermissionSaga`.
    })

    builder.addCase(
        setLocalPermission,
        (state, { payload: { roomId, address, permission, value } }) => {
            const item = getItem(state, { roomId, address })

            if (!item[permission]) {
                item[permission] = {}
            }

            item[permission].value = value
        }
    )

    builder.addCase(invalidatePermissions, (state, { payload: { roomId, address } }) => {
        const item = getItem(state, { roomId, address })

        Object.keys(item).forEach((permission) => {
            const { cache = 0 } = item[permission]

            // This will make any active `useLoadAbilityEffect` refetch.
            item[permission].cache = cache + 1
        })
    })
})

export default reducer
