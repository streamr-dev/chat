import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { UserPermissionAssignment } from 'streamr-client'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import setPermissions from './sagas/setPermissions.saga'
import { MemberState } from './types'
import add from '$/features/member/sagas/add.saga'
import remove from '$/features/member/sagas/remove.saga'

const initialState: MemberState = {
    notices: {},
    ongoingRemoval: {},
    ongoingAddition: {},
}

export const MemberAction = {
    notice: createAction<{ address: Address; timestamp: number }>('member: notice'),
    setPermissions: createAction<{
        roomId: RoomId
        assignments: UserPermissionAssignment[]
    }>('member: set permissions'),
    setOngoingRemoval: createAction<{ roomId: RoomId; address: Address; state: boolean }>(
        'member: set ongoing removal'
    ),
    remove: createAction<{ roomId: RoomId; address: Address }>('member: remove'),
    setOngoingAddition: createAction<{ roomId: RoomId; address: Address; state: boolean }>(
        'member: set ongoing addition'
    ),
    add: createAction<{ roomId: RoomId; address: Address }>('member: add'),
}

function removal(state: MemberState, roomId: RoomId) {
    if (!state.ongoingRemoval[roomId]) {
        state.ongoingRemoval[roomId] = {}
    }

    return state.ongoingRemoval[roomId]
}

function addition(state: MemberState, roomId: RoomId) {
    if (!state.ongoingAddition[roomId]) {
        state.ongoingAddition[roomId] = {}
    }

    return state.ongoingAddition[roomId]
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MemberAction.notice, (state, { payload: { address, timestamp } }) => {
        state.notices[address.toLowerCase()] = timestamp
    })

    builder.addCase(MemberAction.setPermissions, SEE_SAGA)

    builder.addCase(
        MemberAction.setOngoingRemoval,
        (state, { payload: { roomId, address, state: isBeingRemoved } }) => {
            const r = removal(state, roomId)

            const addr = address.toLowerCase()

            if (isBeingRemoved) {
                r[addr] = true
                return
            }

            delete r[addr]
        }
    )

    builder.addCase(MemberAction.remove, SEE_SAGA)

    builder.addCase(MemberAction.add, SEE_SAGA)

    builder.addCase(
        MemberAction.setOngoingAddition,
        (state, { payload: { roomId, address, state: isBeingAdded } }) => {
            const a = addition(state, roomId)

            const addr = address.toLowerCase().trim()

            if (isBeingAdded) {
                a[addr] = true
                return
            }

            delete a[addr]
        }
    )
})

export function* memberSaga() {
    yield all([setPermissions(), add(), remove()])
}

export default reducer
