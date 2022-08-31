import { Contract, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { Provider } from '@web3-react/types'

const DelegatedAccessRegistryAbi = DelegatedAccessRegistry.abi
const DelegatedAccessRegistryAddress = '0x1CF4ee3a493f9B07AE9394F78E1407c2682B0e8C'

const getDelegatedAccessRegistry = (rawProvider: Provider): Contract => {
    return new Contract(
        DelegatedAccessRegistryAddress,
        DelegatedAccessRegistryAbi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}

export { DelegatedAccessRegistryAbi, DelegatedAccessRegistryAddress, getDelegatedAccessRegistry }
