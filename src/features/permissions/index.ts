import lifecycle from '$/features/permissions/sagas/lifecycle.saga'
import { IMember, PermissionsState } from '$/features/permissions/types'
import { RoomId } from '$/features/room/types'
import { Address, IFingerprinted, PreflightParams } from '$/types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { Provider } from '@web3-react/types'
import { all } from 'redux-saga/effects'
import type StreamrClient from 'streamr-client'
import { StreamPermission } from 'streamr-client'

const initialState: PermissionsState = {
    roomMembers: {},
    permissions: {},
}

export const PermissionsAction = {
    detectRoomMembers: createAction<
        IFingerprinted & { roomId: RoomId; streamrClient: StreamrClient; provider: Provider }
    >('permissions: detect room members'),

    setRoomMembers: createAction<{ roomId: RoomId; members: IMember[] }>(
        'permissions: set room members'
    ),

    removeMember: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                member: Address
                streamrClient: StreamrClient
            }
    >('permissions: remove member'),

    addMember: createAction<
        IFingerprinted &
            PreflightParams & { roomId: RoomId; member: Address; streamrClient: StreamrClient }
    >('permissions: add member'),

    acceptInvite: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                member: Address
                streamrClient: StreamrClient
            }
    >('permissions: accept invite'),

    promoteDelegatedAccount: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                delegatedAddress: Address
                streamrClient: StreamrClient
            }
    >('permissions: promote delegated account'),

    join: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                delegatedAddress: Address
                streamrClient: StreamrClient
            }
    >('permissions: token gated promote delegated account'),

    fetchPermission: createAction<
        IFingerprinted & {
            roomId: RoomId
            address: Address
            permission: StreamPermission
            streamrClient: StreamrClient
        }
    >('permissions: fetch permission'),

    fetchPermissions: createAction<
        IFingerprinted & { roomId: RoomId; address: Address; streamrClient: StreamrClient }
    >('permissions: fetch permissions'),

    setPermissions: createAction<{
        roomId: RoomId
        address: Address
        permissions: Partial<Record<StreamPermission, boolean>>
    }>('permissions: set local'),

    invalidateAll: createAction<{
        roomId: RoomId
        address: Address
    }>('permissions: invalidate all'),

    allowAnonsPublish: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                streamrClient: StreamrClient
            }
    >('permissions: allow anons publish'),
}

function permissionGroupPath(state: PermissionsState, roomId: RoomId, address: Address) {
    const addr = address.toLowerCase()

    if (!state.permissions[roomId]) {
        state.permissions[roomId] = {}
    }

    if (!state.permissions[roomId][addr]) {
        state.permissions[roomId][addr] = {}
    }

    return state.permissions[roomId][addr]
}

function permissionPath(
    state: PermissionsState,
    roomId: RoomId,
    address: Address,
    permission: StreamPermission
) {
    const item = permissionGroupPath(state, roomId, address)

    if (!item[permission]) {
        item[permission] = {}
    }

    return item[permission]
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(PermissionsAction.setRoomMembers, (state, { payload: { roomId, members } }) => {
        state.roomMembers[roomId] = members
    })

    b.addCase(
        PermissionsAction.setPermissions,
        (state, { payload: { roomId, address, permissions } }) => {
            Object.entries(permissions).forEach(([permission, value]) => {
                permissionPath(state, roomId, address, permission as StreamPermission).value = value
            })
        }
    )

    b.addCase(PermissionsAction.invalidateAll, (state, { payload: { roomId, address } }) => {
        const item = permissionGroupPath(state, roomId, address)

        Object.keys(item).forEach((permission) => {
            const { cache = 0 } = item[permission]

            // This will make all active `useLoadAbilityEffect` refetch.
            item[permission].cache = cache + 1
        })
    })
})

export default reducer

export function* permissionsSaga() {
    yield all([lifecycle()])
}
