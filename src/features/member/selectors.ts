import { createSelector } from '@reduxjs/toolkit'
import { OptionalAddress, State } from '$/types'
import { MemberState } from './types'

function selectSelf(state: State): MemberState {
    return state.member
}

export function selectNoticedAt(address: OptionalAddress): (state: State) => undefined | number {
    return createSelector(selectSelf, ({ notices }) =>
        address ? notices[address.toLowerCase()] : undefined
    )
}
