import { Contract, providers } from 'ethers'
import { abi } from '$/contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'
import { Provider } from '@web3-react/types'

const DelegatedAccessRegistryAddress = '0x0143825C65D59CD09F5c896d9DE8b7fe952bc5EB'

export default function getDelegatedAccessRegistry(rawProvider: Provider) {
    return new Contract(
        DelegatedAccessRegistryAddress,
        abi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}
