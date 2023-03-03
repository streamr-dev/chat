import { Contract, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { Provider } from '@web3-react/types'

const DelegatedAccessRegistryAbi = DelegatedAccessRegistry.abi

const DelegatedAccessRegistryAddress = '0x0143825C65D59CD09F5c896d9DE8b7fe952bc5EB'

export default function getDelegatedAccessRegistry(rawProvider: Provider) {
    return new Contract(
        DelegatedAccessRegistryAddress,
        DelegatedAccessRegistryAbi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}
