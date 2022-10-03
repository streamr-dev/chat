import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'
import { IdenticonSeed, IdenticonsState } from './types'

function selectSelf(state: State): IdenticonsState {
    return state.identicons
}

export function selectIdenticon(
    seed: undefined | IdenticonSeed
): (state: State) => undefined | string {
    return createSelector(selectSelf, (substate) => (seed ? substate[seed] : undefined))
}
