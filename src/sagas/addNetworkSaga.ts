import { Provider } from '@web3-react/types'
import { Matic } from '../utils/chains'

export default function* addNetworkSaga(provider: Provider) {
    const [, params] = Matic

    yield provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
    })
}
