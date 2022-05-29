import { Provider } from '@web3-react/types'
import { Matic } from '../utils/chains'

export default function* switchNetworkSaga(provider: Provider) {
    const [chainId] = Matic

    yield provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: `0x${chainId.toString(16)}`,
            },
        ],
    })
}
