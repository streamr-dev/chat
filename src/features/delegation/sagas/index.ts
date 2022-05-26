import { takeEvery } from 'redux-saga/effects'
import { setWalletAccount } from '../../wallet/actions'
import resetDelegatedPrivateKeySaga from './resetDelegatedPrivateKeySaga'

export default function* saga() {
    // Reset delegated private key on every `setWalletAccount`. Different account = different delegated wallet.
    yield takeEvery(setWalletAccount, resetDelegatedPrivateKeySaga)
}
