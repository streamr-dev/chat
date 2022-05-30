import { select } from 'redux-saga/effects'
import MissingWalletAccountError from '../../../errors/MissingWalletAccountError'
import { selectWalletAccount } from '../selectors'
import { WalletState } from '../types'

export default function* getWalletAccountSaga() {
    const account: WalletState['account'] = yield select(selectWalletAccount)

    if (!account) {
        throw new MissingWalletAccountError()
    }

    return account
}
