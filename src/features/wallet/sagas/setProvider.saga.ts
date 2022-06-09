import { ethers } from 'ethers'
import { takeLatest, put } from 'redux-saga/effects'
import handleError from '$/utils/handleError'
import { WalletAction } from '..'

export function* onSetProviderAction({
    payload: provider,
}: ReturnType<typeof WalletAction.setProvider>) {
    try {
        if (!provider) {
            yield put(WalletAction.setAccount(null))
            return
        }

        const web3Provider = new ethers.providers.Web3Provider(provider)

        yield put(WalletAction.setAccount(undefined))

        let accounts: string[] = []

        try {
            accounts = yield web3Provider.listAccounts()
        } catch (e) {
            handleError(e)
        }

        yield put(WalletAction.setAccount(accounts[0] || null))
    } catch (e) {
        handleError(e)
    }
}

export default function* setProvider() {
    yield takeLatest(WalletAction.setProvider, onSetProviderAction)
}
