import { PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { takeLatest, put, all, select } from 'redux-saga/effects'
import { StorageKey } from '../../../types/common'
import { WalletState } from './types'
import { setWalletAccount, WalletAction } from './actions'
import { selectWalletIntegrationId } from './selectors'

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

export function* storeWalletIntegrationId() {
    const integrationId: WalletState['integrationId'] = yield select(
        selectWalletIntegrationId
    )

    if (integrationId) {
        localStorage.setItem(StorageKey.WalletIntegrationId, integrationId)
    } else {
        localStorage.removeItem(StorageKey.WalletIntegrationId)
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
