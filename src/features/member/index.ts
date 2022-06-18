import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { Address, IFingerprinted } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import { MemberState } from './types'
import add from '$/features/member/sagas/add.saga'
import remove from '$/features/member/sagas/remove.saga'
import acceptInvite from '$/features/member/sagas/acceptInvite.saga'
import promoteDelegatedAccount from '$/features/member/sagas/promoteDelegatedAccount.saga'

const initialState: MemberState = {
    notices: {},
}

export const MemberAction = {
    notice: createAction<{ address: Address; timestamp: number }>('member: notice'),
    remove: createAction<IFingerprinted & { roomId: RoomId; address: Address }>('member: remove'),
    add: createAction<IFingerprinted & { roomId: RoomId; address: Address }>('member: add'),
    acceptInvite: createAction<
        IFingerprinted & { roomId: RoomId; address: Address; delegatedAddress: Address }
    >('member: accept invite'),
    promoteDelegatedAccount: createAction<
        IFingerprinted & { roomId: RoomId; delegatedAddress: Address }
    >('member: promote delegated account'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MemberAction.notice, (state, { payload: { address, timestamp } }) => {
        state.notices[address.toLowerCase()] = timestamp
    })

    builder.addCase(MemberAction.remove, SEE_SAGA)

    builder.addCase(MemberAction.add, SEE_SAGA)

    builder.addCase(MemberAction.acceptInvite, SEE_SAGA)

    builder.addCase(MemberAction.promoteDelegatedAccount, SEE_SAGA)
})

export function* memberSaga() {
    yield all([add(), remove(), acceptInvite(), promoteDelegatedAccount()])
}

export default reducer
