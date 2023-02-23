import { BigNumber, Contract, providers } from 'ethers'

import * as ERC20 from '../../../contracts/tokens/ERC20Token.sol/ERC20.json'
import * as ERC777 from '../../../contracts/tokens/ERC777Token.sol/ERC777.json'

import * as ERC165 from '../../../contracts/tokens/ERC165.json' // supportsInterface

import { Provider } from '@web3-react/types'
import { Address } from '$/types'
import { InterfaceId, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'

export const getTokenType = async (address: Address, rawProvider: Provider): Promise<TokenType> => {
    let detectedTokenType: TokenType = TokenTypes.unknown
    try {
        const contract = new Contract(
            address,
            ERC165.abi,
            new providers.Web3Provider(rawProvider).getSigner()
        )

        try {
            const supportsERC1155Interface = await contract.supportsInterface(InterfaceId.ERC1155)
            if (supportsERC1155Interface) {
                detectedTokenType = TokenTypes.ERC1155
                return detectedTokenType
            }
        } catch (e2) {
            console.warn('Failed to detect ERC1155 interface')
        }

        try {
            const supportsERC721Interface = await contract.supportsInterface(InterfaceId.ERC721)
            if (supportsERC721Interface) {
                detectedTokenType = TokenTypes.ERC721
                return detectedTokenType
            }
        } catch (e2) {
            console.warn('Failed to detect ERC721 interface')
        }

        try {
            const supportsERC20Interface = await contract.supportsInterface(InterfaceId.ERC20)
            const supportsERC20NameInterface = await contract.supportsInterface(
                InterfaceId.ERC20Name
            )
            const supportsERC20SymbolInterface = await contract.supportsInterface(
                InterfaceId.ERC20Symbol
            )
            const supportsERC20DecimalsInterface = await contract.supportsInterface(
                InterfaceId.ERC20Decimals
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
        } catch (e2) {
            console.warn('Failed to detect ERC20 interface')
        }

        try {
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
                return detectedTokenType
            } else {
                throw new Error('ERC20 balance and totalSupply checks failed')
            }
        } catch (e2) {
            console.warn('Failed to detect ERC20 methods')
        }

        // and since ERC777 doesn't include ERC165, we need to check for it separately
        try {
            const erc777Contract = new Contract(
                address,
                ERC777.abi,
                new providers.Web3Provider(rawProvider).getSigner()
            )

            await erc777Contract.granularity()

            detectedTokenType = TokenTypes.ERC777
        } catch (e2) {
            console.warn('Failed to detect ERC777 interface', e2)
        }
    } catch (e) {
        console.error(e)
        detectedTokenType = TokenTypes.unknown
    }

    return detectedTokenType
}
