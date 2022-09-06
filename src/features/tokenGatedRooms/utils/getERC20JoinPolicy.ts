import { Contract, providers } from 'ethers'
import * as ERC20JoinPolicy from '../../../contracts/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'

import { Provider } from '@web3-react/types'
import { Address } from '$/types'

export const getERC20JoinPolicy = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(
        address,
        ERC20JoinPolicy.abi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}
