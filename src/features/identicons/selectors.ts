import { createSelector } from '@reduxjs/toolkit'
import { IdenticonSeed, IdenticonsState } from './types'

function selectSelf(state: any): IdenticonsState {
    return state.identicons
}

export function selectIdenticon(seed: IdenticonSeed): (state: any) => undefined | string {
    return createSelector(selectSelf, ({ items }) => items[seed.toLowerCase()]?.content)
}

export function selectRetrievingIdenticon(seed: IdenticonSeed): (state: any) => boolean {
    return createSelector(selectSelf, ({ items }) => Boolean(items[seed.toLowerCase()]?.retrieving))
}
