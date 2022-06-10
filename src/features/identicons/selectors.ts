import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'
import { IdenticonSeed, IdenticonsState } from './types'

function selectSelf(state: State): IdenticonsState {
    return state.identicons
}

export function selectIdenticon(seed: IdenticonSeed): (state: State) => undefined | string {
    return createSelector(selectSelf, ({ items }) => items[seed.toLowerCase()]?.content)
}

export function selectRetrievingIdenticon(seed: IdenticonSeed): (state: State) => boolean {
    return createSelector(selectSelf, ({ items }) => Boolean(items[seed.toLowerCase()]?.retrieving))
}
