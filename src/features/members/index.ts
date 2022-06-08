import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { Address } from '../../../types/common'
import { SEE_SAGA } from '../../utils/consts'
import { RoomId } from '../room/types'
import detect from './sagas/detect.saga'
import { MembersState } from './types'

const initialState: MembersState = {
    items: {},
}

export const MembersAction = {
    set: createAction<{ roomId: RoomId; addresses: Address[] }>('members: set'),
    detect: createAction<RoomId>('members: detect'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MembersAction.detect, SEE_SAGA)

    builder.addCase(MembersAction.set, (state, { payload: { roomId, addresses } }) => {
        state.items[roomId] = addresses
    })
})

export function* membersSaga() {
    yield all([detect()])
}

export default reducer
