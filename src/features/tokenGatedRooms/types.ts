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
    standard: 'ERC20' | 'ERC721' | 'ERC777' | 'ERC1155' | 'unknown'
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
    ERC777: {
        standard: 'ERC777',
        isCountable: true,
        hasIds: false,
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

/*
    ERC20: name, symbol, decimals
    ERC721: name, symbol, uri
    ERC777: name, symbol, granularity
    ERC1155: uri
*/
export type TokenMetadata = {
    name?: string
    symbol?: string
    decimals?: BigNumber | string
    uri?: string
    granularity?: BigNumber | string
}

export interface TokenGatedRoomState {
    tokenType?: TokenType
    tokenAddress?: Address
    tokenId?: BigNumber | string
    minRequiredBalance?: BigNumber | string
    stakingEnabled?: boolean
    tokenMetadata?: TokenMetadata
}
