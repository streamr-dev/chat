import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

const AdapterIdKey = 'chat:walletAdapterId'

interface State {
    ethereumProvider: any
    walletAdapterId: string | undefined
    account: string | undefined | null // address | we're checking | not signed in
}

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        ethereumProvider: undefined,
        walletAdapterId: localStorage.getItem(AdapterIdKey) || undefined,
        account: undefined,
    },
    reducers: {
        setEthereumProvider(state: State, action: PayloadAction<any>) {
            state.ethereumProvider = action.payload
        },
        setWalletAdapterId(state: State, action: PayloadAction<string>) {
            localStorage.setItem(AdapterIdKey, action.payload)
            state.walletAdapterId = action.payload
        },
        setAccount(
            state: State,
            action: PayloadAction<string | undefined | null>
        ) {
            state.account = action.payload
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

const selectAccount = createSelector(
    selectSelf,
    (substate: any) => substate.account
)

export function useAccount() {
    return useSelector(selectAccount)
}

export const { setEthereumProvider, setWalletAdapterId, setAccount } =
    sessionSlice.actions

export default sessionSlice.reducer
