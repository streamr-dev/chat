import { createAction } from '@reduxjs/toolkit'
import { IdenticonAction, IdenticonSeed, IIdenticon } from './types'

export const retrieveIdenticon = createAction<IdenticonSeed>(IdenticonAction.Retrieve)

export const setRetrieving = createAction<{
    seed: IdenticonSeed
    value: boolean
}>(IdenticonAction.SetRetrieving)

export const setIdenticon = createAction<IIdenticon>(IdenticonAction.Set)
