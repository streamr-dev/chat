import { Contract, providers } from 'ethers'
import * as ERC20JoinPolicy from '../../../contracts/ERC20JoinPolicy.sol/ERC20JoinPolicy.json'
import * as ERC721JoinPolicy from '../../../contracts/ERC721JoinPolicy.sol/ERC721JoinPolicy.json'
import * as ERC1155JoinPolicy from '../../../contracts/ERC1155JoinPolicy.sol/ERC1155JoinPolicy.json'

import { Provider } from '@web3-react/types'
import { Address } from '$/types'
import { TokenType } from '$/features/tokenGatedRooms/types'

export const getJoinPolicy = (
    address: Address,
    rawProvider: Provider,
    tokenType: TokenType
): Contract => {
    let abi: any
    switch (tokenType.standard) {
        case 'ERC20':
            abi = ERC20JoinPolicy.abi
            break
        case 'ERC721':
            abi = ERC721JoinPolicy.abi
            break
        case 'ERC1155':
            abi = ERC1155JoinPolicy.abi
            break
        default:
            throw new Error('Unsupported token type')
    }

    return new Contract(address, abi, new providers.Web3Provider(rawProvider).getSigner())
}
