import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import { MemberState } from './types'
import add from '$/features/member/sagas/add.saga'
import remove from '$/features/member/sagas/remove.saga'
import acceptInvite from '$/features/member/sagas/acceptInvite.saga'
import promoteDelegatedAccount from '$/features/member/sagas/promoteDelegatedAccount.saga'

const initialState: MemberState = {
    notices: {},
    ongoingRemoval: {},
    ongoingAddition: {},
    ongoingInviteAcceptances: {},
    ongoingPromotions: {},
}

export const MemberAction = {
    notice: createAction<{ address: Address; timestamp: number }>('member: notice'),
    setOngoingRemoval: createAction<{ roomId: RoomId; address: Address; state: boolean }>(
        'member: set ongoing removal'
    ),
    remove: createAction<{ roomId: RoomId; address: Address }>('member: remove'),
    setOngoingAddition: createAction<{ roomId: RoomId; address: Address; state: boolean }>(
        'member: set ongoing addition'
    ),
    add: createAction<{ roomId: RoomId; address: Address }>('member: add'),
    acceptInvite: createAction<{ roomId: RoomId; address: Address; delegatedAddress: Address }>(
        'member: accept invite'
    ),
    setIsAcceptingInvite: createAction<{ roomId: RoomId; address: Address; state: boolean }>(
        'member: set is accepting invite'
    ),
    promoteDelegatedAccount: createAction<{ roomId: RoomId; delegatedAddress: Address }>(
        'member: promote delegated account'
    ),
    setIsPromotingDelegatedAccount: createAction<{
        roomId: RoomId
        delegatedAddress: Address
        state: boolean
    }>('member: set is promoting delegated account'),
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

function acceptances(state: MemberState, roomId: RoomId) {
    if (!state.ongoingInviteAcceptances[roomId]) {
        state.ongoingInviteAcceptances[roomId] = {}
    }

    return state.ongoingInviteAcceptances[roomId]
}

function promotion(state: MemberState, roomId: RoomId) {
    if (!state.ongoingPromotions[roomId]) {
        state.ongoingPromotions[roomId] = {}
    }

    return state.ongoingPromotions[roomId]
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MemberAction.notice, (state, { payload: { address, timestamp } }) => {
        state.notices[address.toLowerCase()] = timestamp
    })

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

    builder.addCase(MemberAction.acceptInvite, SEE_SAGA)

    builder.addCase(
        MemberAction.setIsAcceptingInvite,
        (state, { payload: { roomId, address, state: accepting } }) => {
            const acc = acceptances(state, roomId)

            const addr = address.toLowerCase()

            if (!accepting) {
                delete acc[addr]
                return
            }

            acc[addr] = true
        }
    )

    builder.addCase(MemberAction.promoteDelegatedAccount, SEE_SAGA)

    builder.addCase(
        MemberAction.setIsPromotingDelegatedAccount,
        (state, { payload: { roomId, delegatedAddress, state: promoting } }) => {
            const promo = promotion(state, roomId)

            const addr = delegatedAddress.toLowerCase()

            if (!promoting) {
                delete promo[addr]
                return
            }

            promo[addr] = true
        }
    )
})

export function* memberSaga() {
    yield all([add(), remove(), acceptInvite(), promoteDelegatedAccount()])
}

export default reducer
