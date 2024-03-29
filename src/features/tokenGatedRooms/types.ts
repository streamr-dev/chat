import { Address } from '$/types'

export enum InterfaceId {
    ERC20 = '0x36372b07',
    ERC20Name = '0x06fdde03',
    ERC20Symbol = '0x95d89b41',
    ERC20Decimals = '0x313ce567',
    ERC721 = '0x80ac58cd',
    ERC1155 = '0xd9b67a26',
}

export enum TokenStandard {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    ERC777 = 'ERC777',
    ERC1155 = 'ERC1155',
    Unknown = 'unknown',
}

export interface TokenType {
    standard: TokenStandard
    isCountable: boolean
    hasIds: boolean
}

export const TokenTypes: Record<TokenStandard, TokenType> = {
    [TokenStandard.ERC20]: {
        standard: TokenStandard.ERC20,
        isCountable: true,
        hasIds: false,
    },
    [TokenStandard.ERC721]: {
        standard: TokenStandard.ERC721,
        isCountable: false,
        hasIds: true,
    },
    [TokenStandard.ERC777]: {
        standard: TokenStandard.ERC777,
        isCountable: true,
        hasIds: false,
    },
    [TokenStandard.ERC1155]: {
        standard: TokenStandard.ERC1155,
        isCountable: true,
        hasIds: true,
    },
    [TokenStandard.Unknown]: {
        standard: TokenStandard.Unknown,
        isCountable: false,
        hasIds: false,
    },
}

export interface TokenGate {
    tokenType?: TokenType
    tokenAddress?: Address
    tokenIds?: string[]
    minRequiredBalance?: string
    stakingEnabled?: boolean
}
