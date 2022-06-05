import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { SEE_SAGA } from '../../utils/consts'
import { RoomId } from '../room/types'
import fetch from './sagas/fetch.saga'
import { PermissionState } from './types'

const initialState: PermissionState = {
    items: {},
}

export const PermissionAction = {
    fetch: createAction<{
        roomId: RoomId
        address: Address
        permission: StreamPermission
    }>('permission: fetch'),
    setLocal: createAction<{
        roomId: RoomId
        address: Address
        permission: StreamPermission
        value: boolean
    }>('permission: set local'),
    invalidateAll: createAction<{
        roomId: RoomId
        address: Address
    }>('permission: invalidate all'),
}

interface BuildItemParams {
    roomId: RoomId
    address: Address
}

function getItem(state: PermissionState, { roomId, address }: BuildItemParams) {
    if (!state.items[roomId]) {
        state.items[roomId] = {}
    }

    if (!state.items[roomId][address]) {
        state.items[roomId][address] = {}
    }

    return state.items[roomId][address]
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(PermissionAction.fetch, SEE_SAGA)

    builder.addCase(
        PermissionAction.setLocal,
        (state, { payload: { roomId, address, permission, value } }) => {
            const item = getItem(state, { roomId, address })

            if (!item[permission]) {
                item[permission] = {}
            }

            item[permission].value = value
        }
    )

    builder.addCase(PermissionAction.invalidateAll, (state, { payload: { roomId, address } }) => {
        const item = getItem(state, { roomId, address })

        Object.keys(item).forEach((permission) => {
            const { cache = 0 } = item[permission]

            // This will make any active `useLoadAbilityEffect` refetch.
            item[permission].cache = cache + 1
        })
    })
})

export function* permissionSaga() {
    yield all([fetch()])
}

export default reducer
