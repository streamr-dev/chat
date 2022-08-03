import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import detect from './sagas/detect.saga'
import { IMember, MembersState } from './types'
import StreamrClient from 'streamr-client'
import { IFingerprinted } from '$/types'
import { Provider } from '@web3-react/types'

const initialState: MembersState = {}

export const MembersAction = {
    set: createAction<{ roomId: RoomId; members: IMember[] }>('members: set'),

    detect: createAction<
        IFingerprinted & { roomId: RoomId; streamrClient: StreamrClient; provider: Provider }
    >('members: detect'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MembersAction.detect, SEE_SAGA)

    builder.addCase(MembersAction.set, (state, { payload: { roomId, members } }) => {
        state[roomId] = members
    })
})

export function* membersSaga() {
    yield all([detect()])
}

export default reducer
