import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { SEE_SAGA } from '../../utils/consts'
import { RoomId } from '../room/types'
import setPermissions from './sagas/setPermissions.saga'
import { MemberState } from './types'

const initialState: MemberState = {
    notices: {},
}

export const MemberAction = {
    notice: createAction<{ address: Address; timestamp: number }>('member: notice'),
    setPermissions: createAction<{
        roomId: RoomId
        address: Address
        permissions: StreamPermission[]
    }>('member: set permissions'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MemberAction.notice, (state, { payload: { address, timestamp } }) => {
        state.notices[address.toLowerCase()] = timestamp
    })

    builder.addCase(MemberAction.setPermissions, SEE_SAGA)
})

export function* memberSaga() {
    yield all([setPermissions()])
}

export default reducer