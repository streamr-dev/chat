import { Contract, providers } from 'ethers'
import * as JoinPolicyFactory from '../../../contracts/JoinPolicyFactory.sol/JoinPolicyFactory.json'

import { Provider } from '@web3-react/types'

const JoinPolicyFactoryAbi = JoinPolicyFactory.abi
const JoinPolicyFactoryAddress = '0xC03Ca7261a96C75c86359B00eea31aDdF65cA954' // deployed 25/08/2022

export const getJoinPolicyFactory = (rawProvider: Provider): Contract => {
    return new Contract(
        JoinPolicyFactoryAddress,
        JoinPolicyFactoryAbi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}
