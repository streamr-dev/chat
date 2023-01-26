import goto from '$/features/misc/sagas/goto.saga'
import { MiscState } from '$/features/misc/types'
import { SEE_SAGA } from '$/utils/consts'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'axios'
import { NavigateFunction } from 'react-router-dom'

export const MiscAction = {
    goto: createAction<string>('misc: goto'),

    setNavigate: createAction<{ navigate: undefined | NavigateFunction }>('misc: set navigate'),
}

const initialState: MiscState = {
    navigate: undefined,
}

const reducer = createReducer(initialState, (b) => {
    b.addCase(MiscAction.goto, SEE_SAGA)

    b.addCase(MiscAction.setNavigate, (state, { payload: { navigate } }) => {
        state.navigate = navigate
    })
})

export function* miscSaga() {
    yield all([goto()])
}

export default reducer
