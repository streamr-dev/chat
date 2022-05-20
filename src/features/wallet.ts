import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { StorageItemKey } from '../../types/common'
import { WalletIntegrationId, WalletState } from '../../types/wallet'

const initialState: WalletState = {
    account: undefined,
    integrationId:
        (localStorage.getItem(
            StorageItemKey.WalletIntegrationId
        ) as WalletIntegrationId) || undefined,
}

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWalletIntegrationId(
            state,
            action: PayloadAction<WalletState['integrationId']>
        ) {
            if (typeof action.payload === 'undefined') {
                localStorage.removeItem(StorageItemKey.WalletIntegrationId)
            } else {
                localStorage.setItem(
                    StorageItemKey.WalletIntegrationId,
                    action.payload
                )
            }

            state.integrationId = action.payload
        },
        setAccount(state, action: PayloadAction<WalletState['account']>) {
            state.account = action.payload
        },
    },
})

export const { setWalletIntegrationId, setAccount } = walletSlice.actions

export default walletSlice.reducer

function selectSelf(state: any): WalletState {
    return state.wallet
}

const selectIntegrationId = createSelector(
    selectSelf,
    (substate: WalletState) => substate.integrationId
)

export function useWalletIntegrationId() {
    return useSelector(selectIntegrationId)
}

const selectAccount = createSelector(
    selectSelf,
    (substate: WalletState) => substate.account
)

export function useAccount() {
    return useSelector(selectAccount)
}

export function useCheckingAccount() {
    return typeof useAccount() === 'undefined'
}
