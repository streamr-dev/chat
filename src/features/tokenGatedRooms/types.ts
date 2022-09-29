import { Address } from '$/types'
import { BigNumber } from 'streamr-client'

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

export interface TokenGatedRoomState {
    tokenType: TokenType
    tokenAddress?: Address
    tokenId?: number
    minTokenAmount?: number
    erc20Metadata?: {
        name: string
        symbol: string
        decimals: BigNumber
    }
}
