import { Contract, providers } from 'ethers'
import { Provider } from '@web3-react/types'
import { JoinPolicyRegistryAddress } from '$/features/tokenGatedRooms/utils/const'
import { abi } from '$/contracts/JoinPolicyRegistry.sol/JoinPolicyRegistry.json'

export default function getPolicyRegistry(provider: Provider) {
    return new Contract(
        JoinPolicyRegistryAddress,
        abi,
        new providers.Web3Provider(provider).getSigner()
    )
}
