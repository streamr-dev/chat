import { all, put, takeEvery } from 'redux-saga/effects'
import { WalletAction } from '..'
import handleError from '$/utils/handleError'
import { DelegationAction } from '../../delegation'

function* resetDelegatedPrivateKey() {
    try {
        yield put(DelegationAction.setPrivateKey(undefined))
    } catch (e) {
        handleError(e)
    }
}

export default function* setAccount() {
    yield all([takeEvery(WalletAction.setAccount, resetDelegatedPrivateKey)])
}
