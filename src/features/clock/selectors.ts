import { State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'
import { ClockState } from './types'

function selectSelf(state: State): ClockState {
    return state.clock
}

export const selectTickedAt = createSelector(selectSelf, ({ tickedAt }) => tickedAt)

export const selectStartedAt = createSelector(selectSelf, ({ startedAt }) => startedAt)
