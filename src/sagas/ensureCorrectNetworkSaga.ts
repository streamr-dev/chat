import { Matic } from '../utils/chains'
import { Network } from '@ethersproject/providers'
import { providers } from 'ethers'
import IncorrectNetworkError from '../errors/IncorrectNetworkError'
import { Provider } from '@web3-react/types'

export default function* ensureCorrectNetworkSaga(provider: Provider) {
    const [correctChainId] = Matic

    const { chainId }: Network = yield new providers.Web3Provider(provider).getNetwork()

    if (correctChainId !== chainId) {
        throw new IncorrectNetworkError(correctChainId, chainId)
    }
}
