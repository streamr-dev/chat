import { select } from 'redux-saga/effects'
import MissingWalletProviderError from '../../../errors/MissingWalletProviderError'
import { selectWalletProvider } from '../selectors'
import { WalletState } from '../types'

export default function* getWalletProviderSaga() {
    const provider: WalletState['provider'] = yield select(selectWalletProvider)

    if (!provider) {
        throw new MissingWalletProviderError()
    }

    return provider
}
