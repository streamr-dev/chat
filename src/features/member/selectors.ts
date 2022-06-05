import { createSelector } from '@reduxjs/toolkit'
import { OptionalAddress } from '../../../types/common'
import { MemberState } from './types'

function selectSelf(state: any): MemberState {
    return state.member
}

export function selectNoticedAt(address: OptionalAddress): (state: any) => undefined | number {
    return createSelector(selectSelf, ({ notices }) =>
        address ? notices[address.toLowerCase()] : undefined
    )
}
