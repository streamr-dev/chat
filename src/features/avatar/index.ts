import { Address, IFingerprinted } from '$/types'
import { createAction, createReducer } from '@reduxjs/toolkit'

export const AvatarAction = {
    retrieve: createAction<
        IFingerprinted & {
            ens: string
        }
    >('avatar: retrieve'),

    set: createAction<{ ens: string; uri: string | null }>('avatar: set'),
}

interface AvatarState {
    urls: Record<Address, string | null>
}

const initialState: AvatarState = {
    urls: {},
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(AvatarAction.set, (state, { payload: { ens, uri } }) => {
        state.urls[ens] = uri
    })
})

export default reducer
