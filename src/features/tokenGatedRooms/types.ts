import { RoomId } from '$/features/room/types'
import { Address } from '$/types'

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

export type TokenMetadata = {
    contractAddress: Address
}

export type HexSerializedBigNumber = string

export type TokenERC20Metadata = TokenMetadata & {
    name: string
    symbol: string
    decimals: number
}

export type TokenERC721Metadata = TokenMetadata & {
    tokenId: HexSerializedBigNumber
    name: string
    symbol: string
    tokenUri: string
    fetchedMetadata: { [key: string]: string }
}

export type TokenERC1155Metadata = TokenMetadata & {
    tokenId: HexSerializedBigNumber
    name: string
    symbol: string
    tokenUri: string
    fetchedMetadata: { [key: string]: string }
}

export interface TokenGatedRoomState {
    selectedRoomId?: RoomId
    tokenType: TokenType
    tokenAddress?: Address
    tokenId?: HexSerializedBigNumber
    minTokenAmount?: number
    tokenMetadata?: TokenERC20Metadata | TokenERC721Metadata | TokenERC1155Metadata
}
