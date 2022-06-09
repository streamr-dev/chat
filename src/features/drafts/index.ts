import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '$/utils/consts'
import store from './sagas/store.saga'
import { IDraft } from './types'

export const DraftAction = {
    store: createAction<IDraft>('drafts: store'),
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(DraftAction.store, SEE_SAGA)
})

export function* draftsSaga() {
    yield all([store()])
}

export default reducer
