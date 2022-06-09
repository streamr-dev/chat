import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import fetch from './sagas/fetch.saga'
import fetchAll from './sagas/fetchAll.saga'
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
    setFetching: createAction<{
        roomId: RoomId
        address: Address
        permission: StreamPermission
        state: boolean
    }>('permission: set fetching'),
    setLocal: createAction<{
        roomId: RoomId
        address: Address
        permissions: {
            [permission: string]: boolean
        }
    }>('permission: set local'),
    invalidateAll: createAction<{
        roomId: RoomId
        address: Address
    }>('permission: invalidate all'),
    setFetchingAll: createAction<{
        roomId: RoomId
        address: Address
        state: boolean
    }>('permission: set fetching all'),
    fetchAll: createAction<{ roomId: RoomId; address: Address }>('permission: fetch all'),
}

function addr(state: PermissionState, roomId: RoomId, address: Address) {
    if (!state.items[roomId]) {
        state.items[roomId] = {}
    }

    if (!state.items[roomId][address]) {
        state.items[roomId][address] = {
            fetchingAll: false,
            permissions: {},
        }
    }

    return state.items[roomId][address]
}

function perm(
    state: PermissionState,
    roomId: RoomId,
    address: Address,
    permission: StreamPermission
) {
    const item = addr(state, roomId, address.toLowerCase())

    if (!item.permissions[permission]) {
        item.permissions[permission] = {
            fetching: false,
        }
    }

    return item.permissions[permission]
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(PermissionAction.fetch, SEE_SAGA)

    builder.addCase(
        PermissionAction.setLocal,
        (state, { payload: { roomId, address, permissions } }) => {
            Object.entries(permissions).forEach(([permission, value]) => {
                perm(state, roomId, address, permission as StreamPermission).value = value
            })
        }
    )

    builder.addCase(PermissionAction.invalidateAll, (state, { payload: { roomId, address } }) => {
        const item = addr(state, roomId, address.toLowerCase()).permissions

        Object.keys(item).forEach((permission) => {
            const { cache = 0 } = item[permission]

            // This will make any active `useLoadAbilityEffect` refetch.
            item[permission].cache = cache + 1
        })
    })

    builder.addCase(
        PermissionAction.setFetching,
        (state, { payload: { roomId, address, permission, state: fetching } }) => {
            perm(state, roomId, address, permission).fetching = fetching
        }
    )

    builder.addCase(PermissionAction.fetchAll, SEE_SAGA)

    builder.addCase(
        PermissionAction.setFetchingAll,
        (state, { payload: { roomId, address, state: fetchingAll } }) => {
            addr(state, roomId, address.toLowerCase()).fetchingAll = fetchingAll
        }
    )
})

export function* permissionSaga() {
    yield all([fetch(), fetchAll()])
}

export default reducer
