import { FlagState } from '$/features/flag/types'
import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'

function selectSelf(state: State): FlagState {
    return state.flag
}

export function selectFlag(key: string) {
    return createSelector(selectSelf, (substate: FlagState) => Boolean(substate[key]))
}
