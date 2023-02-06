import lifecycle from '$/features/permissions/sagas/lifecycle.saga'
import { IMember, PermissionsState } from '$/features/permissions/types'
import { RoomId } from '$/features/room/types'
import { Address, IFingerprinted, PreflightParams } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { Provider } from '@web3-react/types'
import { all } from 'redux-saga/effects'
import type StreamrClient from 'streamr-client'

const initialState: PermissionsState = {
    roomMembers: {},
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
                delegatedAddress: Address
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

    tokenGatedPromoteDelegatedAccount: createAction<
        IFingerprinted &
            PreflightParams & {
                roomId: RoomId
                delegatedAddress: Address
                streamrClient: StreamrClient
            }
    >('permissions: token gated promote delegated account'),
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(PermissionsAction.setRoomMembers, (state, { payload: { roomId, members } }) => {
        state.roomMembers[roomId] = members
    })
})

export default reducer

export function* permissionsSaga() {
    yield all([lifecycle()])
}
