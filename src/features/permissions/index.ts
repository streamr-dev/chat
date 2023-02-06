import lifecycle from '$/features/permissions/sagas/lifecycle.saga'
import { IMember, PermissionsState } from '$/features/permissions/types'
import { RoomId } from '$/features/room/types'
import { IFingerprinted } from '$/types'
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
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(PermissionsAction.detectRoomMembers, SEE_SAGA)

    b.addCase(PermissionsAction.setRoomMembers, (state, { payload: { roomId, members } }) => {
        state.roomMembers[roomId] = members
    })
})

export default reducer

export function* permissionsSaga() {
    yield all([lifecycle()])
}
