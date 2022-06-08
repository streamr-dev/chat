import { Network } from '@ethersproject/providers'
import { Provider } from '@web3-react/types'
import { providers } from 'ethers'
import { Matic } from './chains'

export default async function isCorrectNetwork(provider: Provider) {
    const [correctChainId] = Matic

    const { chainId }: Network = await new providers.Web3Provider(provider).getNetwork()

    return correctChainId === chainId
}
