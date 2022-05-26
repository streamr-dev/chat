import { PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { takeLatest, put, all } from 'redux-saga/effects'
import { StorageItemKey } from '../../../types/common'
import { WalletState } from '../../../types/wallet'
import { setWalletAccount, WalletAction } from './actions'

export function* extractWalletAccount({
    payload: provider,
}: PayloadAction<WalletState['provider']>) {
    if (!provider) {
        yield put(setWalletAccount(null))
        return
    }

    const web3Provider = new ethers.providers.Web3Provider(provider)

    yield put(setWalletAccount(undefined))

    let accounts: string[] = []

    try {
        accounts = yield web3Provider.listAccounts()
    } catch (e) {
        console.warn('Failed to list accounts', e)
    }

    yield put(setWalletAccount(accounts[0] || null))
}

// eslint-disable-next-line require-yield
export function* storeWalletIntegrationId({
    payload,
}: PayloadAction<WalletState['integrationId']>) {
    if (payload) {
        localStorage.setItem(StorageItemKey.WalletIntegrationId, payload)
    } else {
        localStorage.removeItem(StorageItemKey.WalletIntegrationId)
    }
}

export default function* saga() {
    yield all([
        takeLatest(
            WalletAction.SetWalletIntegrationId,
            storeWalletIntegrationId
        ),
        takeLatest(WalletAction.SetWalletProvider, extractWalletAccount),
    ])
}
