import { Provider } from '@web3-react/types'
import { Matic } from '$/utils/chains'

export default async function addNetwork(provider: Provider) {
    const [, params] = Matic

    await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
    })
}
