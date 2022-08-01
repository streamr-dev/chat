import { Contract, providers } from 'ethers'
import * as DelegatedAccessRegistry from '../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { Provider } from '@web3-react/types'

const DelegatedAccessRegistryAbi = DelegatedAccessRegistry.abi
const DelegatedAccessRegistryAddress = '0xB3042ecFC4Ba4ef213A38B1C2541E9234a6189cc'

const getDelegatedAccessRegistryAt = (rawProvider: Provider): Contract => {
    return new Contract(
        DelegatedAccessRegistryAddress,
        DelegatedAccessRegistryAbi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}

export { DelegatedAccessRegistryAbi, DelegatedAccessRegistryAddress, getDelegatedAccessRegistryAt }
