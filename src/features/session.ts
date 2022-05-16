import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        ethereumProvider: undefined,
    },
    reducers: {
        setEthereumProvider(state, action: PayloadAction<any>) {
            state.ethereumProvider = action.payload
        },
    },
})

function selectSelf(state: any) {
    return state.session
}

export const selectEthereumProvider = createSelector(
    selectSelf,
    (substate: any) => substate.ethereumProvider
)

export const { setEthereumProvider } = sessionSlice.actions

export default sessionSlice.reducer
