import { Provider } from '@web3-react/types'
import { Matic } from '../utils/chains'

export default async function switchNetwork(provider: Provider) {
    const [chainId] = Matic

    await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: `0x${chainId.toString(16)}`,
            },
        ],
    })
}
