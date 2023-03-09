import MissingWalletProviderError from '$/errors/MissingWalletProviderError'
import { selectWalletProvider } from '$/features/wallet/selectors'
import { Provider } from '@web3-react/types'
import { select } from 'redux-saga/effects'

export default function* getWalletProvider() {
    const provider: Provider | undefined = yield select(selectWalletProvider)

    if (!provider) {
        throw new MissingWalletProviderError()
    }

    return provider
}
