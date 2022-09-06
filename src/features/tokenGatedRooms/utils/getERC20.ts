import { Contract, providers } from 'ethers'

import * as ERC20 from '../../../contracts/ERC20JoinPolicy.sol/TestERC20.json'

import { Provider } from '@web3-react/types'
import { Address } from '$/types'

export const getERC20 = (address: Address, rawProvider: Provider): Contract => {
    return new Contract(address, ERC20.abi, new providers.Web3Provider(rawProvider).getSigner())
}
