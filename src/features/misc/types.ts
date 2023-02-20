import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import { NavigateFunction } from 'react-router-dom'

export interface MiscState {
    filteredKnownTokens: TokenInfo[]
    knownTokens: TokenInfo[]
    knownTokensFilter: string
    navigate: undefined | NavigateFunction
    tokenStandards: Record<Address, TokenStandard>
}

export interface TokenInfo {
    address: Address
    logo: string
    name: string
    symbol: string
}
