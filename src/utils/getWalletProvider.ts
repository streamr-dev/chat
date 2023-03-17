import MissingWalletProviderError from '$/errors/MissingWalletProviderError'
import { selectWalletIntegrationId } from '$/features/wallet/selectors'
import { WalletIntegrationId } from '$/features/wallet/types'
import getConnector from '$/utils/getConnector'
import { Provider } from '@web3-react/types'
import { call, select } from 'redux-saga/effects'

export default function* getWalletProvider() {
    let provider: Provider | undefined

    yield call(function* () {
        const integrationId: WalletIntegrationId | undefined = yield select(
            selectWalletIntegrationId
        )

        provider = getConnector(integrationId)[0].provider
    })

    if (!provider) {
        throw new MissingWalletProviderError()
    }

    return provider
}
