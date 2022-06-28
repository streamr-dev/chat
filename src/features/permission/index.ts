import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import StreamrClient, { StreamPermission } from 'streamr-client'
import { Address, IFingerprinted } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import fetch from './sagas/fetch.saga'
import fetchAll from './sagas/fetchAll.saga'
import { PermissionState } from './types'

const initialState: PermissionState = {}

export const PermissionAction = {
    fetch: createAction<
        IFingerprinted & {
            roomId: RoomId
            address: Address
            permission: StreamPermission
            streamrClient: StreamrClient
        }
    >('permission: fetch'),

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

    fetchAll: createAction<
        IFingerprinted & { roomId: RoomId; address: Address; streamrClient: StreamrClient }
    >('permission: fetch all'),
}

function addr(state: PermissionState, roomId: RoomId, address: Address) {
    if (!state[roomId]) {
        state[roomId] = {}
    }

    if (!state[roomId][address]) {
        state[roomId][address] = {}
    }

    return state[roomId][address]
}

function perm(
    state: PermissionState,
    roomId: RoomId,
    address: Address,
    permission: StreamPermission
) {
    const item = addr(state, roomId, address.toLowerCase())

    if (!item[permission]) {
        item[permission] = {}
    }

    return item[permission]
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
        const item = addr(state, roomId, address.toLowerCase())

        Object.keys(item).forEach((permission) => {
            const { cache = 0 } = item[permission]

            // This will make any active `useLoadAbilityEffect` refetch.
            item[permission].cache = cache + 1
        })
    })

    builder.addCase(PermissionAction.fetchAll, SEE_SAGA)
})

export function* permissionSaga() {
    yield all([fetch(), fetchAll()])
}

export default reducer
