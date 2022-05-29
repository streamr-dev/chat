import { PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { takeLatest, put } from 'redux-saga/effects'
import { WalletState } from '../types'
import { setWalletAccount, WalletAction } from '../actions'

export function* onSetWalletProviderAction({
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

export default function* extractWalletAccountSaga() {
    yield takeLatest(WalletAction.SetWalletProvider, onSetWalletProviderAction)
}
