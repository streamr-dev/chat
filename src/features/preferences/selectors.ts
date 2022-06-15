import { OptionalAddress, State } from '$/types'
import { createSelector } from '@reduxjs/toolkit'

function selectSelf(state: State) {
    return state.preferences
}

export function selectIsSetting(owner: OptionalAddress) {
    return createSelector(selectSelf, ({ ongoingSetting }) =>
        owner ? Boolean(ongoingSetting[owner]) : false
    )
}
