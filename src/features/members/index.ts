import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import { RoomId } from '../room/types'
import detect from './sagas/detect.saga'
import { IMember, MembersState } from './types'
import StreamrClient from 'streamr-client'
import { Address, IFingerprinted } from '$/types'
import { Provider } from '@web3-react/types'
import lookupDelegation from '$/features/members/sagas/lookupDelegation.saga'

const initialState: MembersState = {
    members: {},
    delegations: {},
}

export const MembersAction = {
    set: createAction<{ roomId: RoomId; members: IMember[] }>('members: set'),

    detect: createAction<
        IFingerprinted & { roomId: RoomId; streamrClient: StreamrClient; provider: Provider }
    >('members: detect'),

    setDelegation: createAction<{ main: Address; delegated: Address }>('members: set delegation'),

    lookupDelegation: createAction<
        IFingerprinted & {
            delegated: Address
            provider: Provider
        }
    >('members: lookup delegation'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(MembersAction.detect, SEE_SAGA)

    builder.addCase(MembersAction.set, (state, { payload: { roomId, members } }) => {
        state.members[roomId] = members
    })

    builder.addCase(MembersAction.setDelegation, (state, { payload: { main, delegated } }) => {
        console.log(`Delegation: ${delegated} -> ${main}`)
        state.delegations[delegated] = main
    })

    builder.addCase(MembersAction.lookupDelegation, SEE_SAGA)
})

export function* membersSaga() {
    yield all([detect(), lookupDelegation()])
}

export default reducer
