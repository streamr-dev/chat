import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import detect from './sagas/detect.saga'
import { IMember, MembersState } from './types'

const initialState: MembersState = {
    items: {},
}

export const MembersAction = {
    set: createAction<{ roomId: RoomId; members: IMember[] }>('members: set'),
    detect: createAction<RoomId>('members: detect'),
    setFetching: createAction<{ roomId: RoomId; state: boolean }>('members: fetching'),
}

function item(state: MembersState, roomId: RoomId) {
    if (!state.items[roomId]) {
        state.items[roomId] = {
            members: [],
            fetching: false,
        }
    }

    return state.items[roomId]
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MembersAction.detect, SEE_SAGA)

    builder.addCase(MembersAction.set, (state, { payload: { roomId, members } }) => {
        item(state, roomId).members = members
    })

    builder.addCase(
        MembersAction.setFetching,
        (state, { payload: { roomId, state: fetching } }) => {
            item(state, roomId).fetching = fetching
        }
    )
})

export function* membersSaga() {
    yield all([detect()])
}

export default reducer
