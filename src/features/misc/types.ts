import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { Address, TokenMetadata } from '$/types'
import { NavigateFunction } from 'react-router-dom'

export interface MiscState {
    filteredKnownTokens: TokenInfo[]
    knownTokens: TokenInfo[]
    knownTokensByAddress: Record<Address, TokenInfo | undefined>
    knownTokensFilter: string
    navigate: undefined | NavigateFunction
    tokenStandards: Record<Address, TokenStandard>
    tokenMetadatas: Record<Address, TokenMetadata>
}

export interface TokenInfo {
    address: Address
    logo: string
    name: string
    symbol: string
}
