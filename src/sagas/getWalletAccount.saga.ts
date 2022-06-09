import { select } from 'redux-saga/effects'
import MissingWalletAccountError from '$/errors/MissingWalletAccountError'
import { selectWalletAccount } from '$/features/wallet/selectors'
import { WalletState } from '$/features/wallet/types'

export default function* getWalletAccount() {
    const account: WalletState['account'] = yield select(selectWalletAccount)

    if (!account) {
        throw new MissingWalletAccountError()
    }

    return account
}
