import { BigNumber, Contract, providers } from 'ethers'
import * as JoinPolicyRegistry from '../contracts/JoinPolicyRegistry.sol/JoinPolicyRegistry.json'
import * as ERC20 from '../contracts/ERC20JoinPolicy.sol/TestERC20.json'
import * as ERC165 from '../contracts/ERC165.json' // supportsInterface

import { Provider } from '@web3-react/types'
import { Address } from '$/types'

const JoinPolicyRegistryAbi = JoinPolicyRegistry.abi
const JoinPolicyRegistryAddress = '0x32C38c277e62227980D60cC41040BdCadcf54cdA'

export enum ErcToInterfaceIds {
    ERC20 = '0x36372b07',
    ERC20Name = '0x06fdde03',
    ERC20Symbol = '0x95d89b41',
    ERC20Decimals = '0x313ce567',
    ERC721 = '0x80ac58cd',
    ERC1155 = '0xd9b67a26',
}

export type TokenType = {
    standard: 'ERC20' | 'ERC721' | 'ERC1155' | 'unknown'
    isCountable: boolean
    hasIds: boolean
}
export const TokenTypes: { [key: string]: TokenType } = {
    ERC20: {
        standard: 'ERC20',
        isCountable: true,
        hasIds: false,
    },
    ERC721: {
        standard: 'ERC721',
        isCountable: false,
        hasIds: true,
    },
    ERC1155: {
        standard: 'ERC1155',
        isCountable: true,
        hasIds: true,
    },
    unknown: {
        standard: 'unknown',
        isCountable: false,
        hasIds: false,
    },
}

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

export const getJoinPolicyRegistryAt = (rawProvider: Provider): Contract => {
    return new Contract(
        JoinPolicyRegistryAddress,
        JoinPolicyRegistryAbi,
        new providers.Web3Provider(rawProvider).getSigner()
    )
}

export const registerERC20Policy = async (
    tokenAddress: string,
    streamId: string,
    minTokenAmount: number,
    rawProvider: Provider
): Promise<void> => {
    const contract = getJoinPolicyRegistryAt(rawProvider)
    const res = await contract.registerERC20Policy(
        tokenAddress,
        streamId,
        BigNumber.from(minTokenAmount)
    )

    console.log('registerErc20Policy', res)
}
