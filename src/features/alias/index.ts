import set from '$/features/alias/sagas/set.saga'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'

export const AliasAction = {
    set: createAction<{
        address: Address
        owner: Address
        value: string
    }>('alias: create'),
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(AliasAction.set, SEE_SAGA)
})

export function* aliasSaga() {
    yield all([set()])
}

export default reducer
