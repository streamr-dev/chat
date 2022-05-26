import { createReducer } from '@reduxjs/toolkit'
import { StorageItemKey } from '../../../types/common'
import { WalletIntegrationId, WalletState } from '../../../types/wallet'
import { setWalletAccount, setWalletIntegrationId } from './actions'

const initialState: WalletState = {
    account: undefined,
    integrationId:
        (localStorage.getItem(
            StorageItemKey.WalletIntegrationId
        ) as WalletIntegrationId) || undefined,
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(setWalletIntegrationId, (state, action) => {
        if (action.payload) {
            localStorage.setItem(
                StorageItemKey.WalletIntegrationId,
                action.payload
            )
        } else {
            localStorage.removeItem(StorageItemKey.WalletIntegrationId)
        }

        state.integrationId = action.payload
    })

    builder.addCase(setWalletAccount, (state, action) => {
        state.account = action.payload
    })
})

export default reducer
