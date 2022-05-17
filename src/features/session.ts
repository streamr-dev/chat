import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

const AdapterIdKey = 'chat:walletAdapterId'

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        ethereumProvider: undefined,
        walletAdapterId: localStorage.getItem(AdapterIdKey) || undefined,
    },
    reducers: {
        setEthereumProvider(state, action: PayloadAction<any>) {
            state.ethereumProvider = action.payload
        },
        setWalletAdapterId(state, action: PayloadAction<string>) {
            localStorage.setItem(AdapterIdKey, action.payload)
            state.walletAdapterId = action.payload
        },
    },
})

function selectSelf(state: any) {
    return state.session
}

const selectEthereumProvider = createSelector(
    selectSelf,
    (substate: any) => substate.ethereumProvider
)

export function useEthereumProvider() {
    return useSelector(selectEthereumProvider)
}

const selectWalletAdapterId = createSelector(
    selectSelf,
    (substate: any) => substate.walletAdapterId
)

export function useWalletAdapterId() {
    return useSelector(selectWalletAdapterId)
}

export const { setEthereumProvider, setWalletAdapterId } = sessionSlice.actions

export default sessionSlice.reducer
