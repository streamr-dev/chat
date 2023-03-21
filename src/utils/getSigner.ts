import { Provider } from '@web3-react/types'
import { providers } from 'ethers'

export default function getSigner(provider: Provider) {
    return new providers.Web3Provider(provider).getSigner()
}
