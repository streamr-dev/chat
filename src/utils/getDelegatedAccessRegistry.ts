import { Contract, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { Provider } from '@web3-react/types'

const DelegatedAccessRegistryAbi = DelegatedAccessRegistry.abi

const DelegatedAccessRegistryAddress = '0x1CF4ee3a493f9B07AE9394F78E1407c2682B0e8C'

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
