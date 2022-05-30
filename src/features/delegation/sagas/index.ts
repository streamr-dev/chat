import { all, call, put, takeEvery } from 'redux-saga/effects'
import handleError from '../../../utils/handleError'
import { WalletAction } from '../../wallet/actions'
import { DelegationAction, setDelegatedPrivateKey } from '../actions'
import requestDelegatedPrivateKeySaga from './requestDelegatedPrivateKeySaga'

export default function* delegationSaga() {
    yield all([
        takeEvery(WalletAction.SetWalletAccount, function* () {
            // Different wallet account = different delegated priv key, etc.
            yield put(setDelegatedPrivateKey(undefined))
        }),
        takeEvery(DelegationAction.RequestDelegatedPrivateKey, function* () {
            try {
                yield call(requestDelegatedPrivateKeySaga)
            } catch (e) {
                handleError(e)
            }
        }),
    ])
}
