import { createSelector } from '@reduxjs/toolkit'
import { OptionalAddress, State } from '$/types'
import { MemberState } from './types'

function selectSelf(state: State): MemberState {
    return state.member
}

export function selectNoticedAt(address: OptionalAddress): (state: State) => undefined | number {
    if (!address) {
        return () => undefined
    }

    return createSelector(selectSelf, ({ notices }) => notices[address.toLowerCase()])
}
