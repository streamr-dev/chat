import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import fetch from './sagas/fetch.saga'
import StreamrClient from 'streamr-client'
import { Address } from '$/types'

export const RoomsAction = {
    fetch: createAction<{ requester: Address; streamrClient: StreamrClient }>('rooms: fetch'),
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(RoomsAction.fetch, SEE_SAGA)
})

export function* roomsSaga() {
    yield all([fetch()])
}

export default reducer
