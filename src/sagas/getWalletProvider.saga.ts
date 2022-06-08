import { select } from 'redux-saga/effects'
import MissingWalletProviderError from '../errors/MissingWalletProviderError'
import { selectWalletProvider } from '../features/wallet/selectors'
import { WalletState } from '../features/wallet/types'

export default function* getWalletProvider() {
    const provider: WalletState['provider'] = yield select(selectWalletProvider)

    if (!provider) {
        throw new MissingWalletProviderError()
    }

    return provider
}
