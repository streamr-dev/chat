import fetchNames from '$/features/ens/sagas/fetchNames.saga'
import store from '$/features/ens/sagas/store.saga'
import { IENSName } from '$/features/ens/types'
import { Address, IFingerprinted } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'

export const EnsAction = {
    fetchNames: createAction<Address[]>('ens: fetch names'),

    store: createAction<IFingerprinted & { record: IENSName }>('ens: store'),
}

const reducer = createReducer({}, (builder) => {
    builder.addCase(EnsAction.fetchNames, SEE_SAGA)

    builder.addCase(EnsAction.store, SEE_SAGA)
})

export function* ensSaga() {
    yield all([fetchNames(), store()])
}

export default reducer
