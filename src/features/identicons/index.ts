import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import { SEE_SAGA } from '../../utils/consts'
import retrieve from './sagas/retrieve.saga'
import { IdenticonSeed, IdenticonsState, IIdenticon } from './types'

const initialState: IdenticonsState = {
    items: {},
}

function getItem({ items }: IdenticonsState, seed: string) {
    if (!items[seed]) {
        items[seed] = {
            content: undefined,
            retrieving: false,
        }
    }

    return items[seed]
}

export const IdenticonAction = {
    retrieve: createAction<IdenticonSeed>('identicons: retrieve'),
    set: createAction<IIdenticon>('identicons: set'),
    setRetrieving: createAction<{
        seed: IdenticonSeed
        value: boolean
    }>('identicons: set retrieving'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(IdenticonAction.retrieve, SEE_SAGA)

    builder.addCase(IdenticonAction.set, (state, { payload: { seed, content } }) => {
        getItem(state, seed).content = content
    })

    builder.addCase(
        IdenticonAction.setRetrieving,
        (state, { payload: { seed, value: retrieving } }) => {
            getItem(state, seed).retrieving = retrieving
        }
    )
})

export function* identiconsSaga() {
    yield all([retrieve()])
}

export default reducer
