import { BigNumber, Contract, providers } from 'ethers'

import * as ERC20 from '../../../contracts/tokens/ERC20Token.sol/ERC20.json'

import * as ERC165 from '../../../contracts/tokens/ERC165.json' // supportsInterface

import { Provider } from '@web3-react/types'
import { Address } from '$/types'
import { ErcToInterfaceIds, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'

export const getTokenType = async (address: Address, rawProvider: Provider): Promise<TokenType> => {
    let detectedTokenType: TokenType = TokenTypes.unknown
    try {
        const contract = new Contract(
            address,
            ERC165.abi,
            new providers.Web3Provider(rawProvider).getSigner()
        )

        const supportsERC1155Interface = await contract.supportsInterface(ErcToInterfaceIds.ERC1155)
        if (supportsERC1155Interface) {
            detectedTokenType = TokenTypes.ERC1155
            return detectedTokenType
        }

        const supportsERC721Interface = await contract.supportsInterface(ErcToInterfaceIds.ERC721)
        if (supportsERC721Interface) {
            detectedTokenType = TokenTypes.ERC721
            return detectedTokenType
        }

        const supportsERC20Interface = await contract.supportsInterface(ErcToInterfaceIds.ERC20)
        const supportsERC20NameInterface = await contract.supportsInterface(
            ErcToInterfaceIds.ERC20Name
        )
        const supportsERC20SymbolInterface = await contract.supportsInterface(
            ErcToInterfaceIds.ERC20Symbol
        )
        const supportsERC20DecimalsInterface = await contract.supportsInterface(
            ErcToInterfaceIds.ERC20Decimals
        )

        if (
            supportsERC20Interface ||
            (supportsERC20NameInterface &&
                supportsERC20SymbolInterface &&
                supportsERC20DecimalsInterface)
        ) {
            detectedTokenType = TokenTypes.ERC20
            return detectedTokenType
        }

        // still, erc20 is not compulsory erc165 so time for specific checks
        const erc20Contract = new Contract(
            address,
            ERC20.abi,
            new providers.Web3Provider(rawProvider).getSigner()
        )

        const balanceCheck: BigNumber = await erc20Contract.balanceOf(erc20Contract.address)
        const totalSupplyCheck: BigNumber = await erc20Contract.totalSupply()

        if (balanceCheck.gte(0) && totalSupplyCheck.gte(0)) {
            detectedTokenType = TokenTypes.ERC20
        }
    } catch (e) {
        console.warn(e)
        detectedTokenType = TokenTypes.unknown
    }
    return detectedTokenType
}
