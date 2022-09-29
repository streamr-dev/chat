import { Contract, providers } from 'ethers'
import * as JoinPolicyFactory from '../../../contracts/JoinPolicyFactory.sol/JoinPolicyFactory.json'

import { Provider } from '@web3-react/types'

const JoinPolicyFactoryAbi = JoinPolicyFactory.abi
const JoinPolicyFactoryAddress = '0xAADDB7C44242aC60c7A73e13A3988957FCDfF34B' // deployed 06/09/2022

export const getJoinPolicyFactory = (rawProvider: Provider): Contract => {
    return new Contract(
        JoinPolicyFactoryAddress,
        JoinPolicyFactoryAbi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}
