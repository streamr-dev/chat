import { Contract, providers } from 'ethers'
import { abi } from '$/contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { Provider } from '@web3-react/types'

const DelegatedAccessRegistryAddress = '0x7D7272C07705a5729b5D229c15192455Fa2b1eb4'

export default function getDelegatedAccessRegistry(rawProvider: Provider) {
    return new Contract(
        DelegatedAccessRegistryAddress,
        abi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}
