import { Contract, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { Provider } from '@web3-react/types'

const DelegatedAccessRegistryAbi = DelegatedAccessRegistry.abi

const DelegatedAccessRegistryAddress = '0x7D7272C07705a5729b5D229c15192455Fa2b1eb4'

let contract: Contract

export default function getDelegatedAccessRegistry(rawProvider: Provider) {
    if (!contract) {
        contract = new Contract(
            DelegatedAccessRegistryAddress,
            DelegatedAccessRegistryAbi,
            new providers.Web3Provider(rawProvider).getSigner()
        )
    }

    return contract
}
