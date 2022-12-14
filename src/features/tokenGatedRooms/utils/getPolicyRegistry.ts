import { Contract, providers } from 'ethers'
import { Provider } from '@web3-react/types'
import { JoinPolicyRegistryAddress } from '$/features/tokenGatedRooms/utils/const'

import * as JoinPolicyRegistry from '$/contracts/JoinPolicyRegistry.sol/JoinPolicyRegistry.json'

export const getPolicyRegistry = (provider: Provider): Contract => {
    const signer = new providers.Web3Provider(provider).getSigner()

    return new Contract(JoinPolicyRegistryAddress, JoinPolicyRegistry.abi, signer)
}
