import { TokenGate, TokenStandard, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'
import { Address, IFingerprinted } from '$/types'
import { Provider } from '@web3-react/types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import StreamrClient from 'streamr-client'
import { RoomId } from '$/features/room/types'

const initialState: TokenGate = {
    tokenType: TokenTypes.unknown,
    tokenAddress: undefined,
    tokenIds: undefined,
    minRequiredBalance: undefined,
    tokenMetadata: {},
}

export const TokenGatedRoomAction = {
    join: createAction<{
        tokenAddress: string
        tokenType: TokenType
        roomId: RoomId
        stakingEnabled: boolean
        provider: Provider
        tokenId?: string
    }>('tokenGatedRooms: join'),

    promoteDelegatedAccount: createAction<{
        roomId: RoomId
        provider: Provider
        streamrClient: StreamrClient
    }>('tokenGatedRooms: promoteDelegatedAccount'),

    getTokenMetadata: createAction<
        IFingerprinted & {
            tokenAddress: Address
            tokenIds: string[]
            tokenStandard: TokenStandard
            provider: Provider
        }
    >('tokenGatedRooms: getTokenMetadata'),

    setTokenMetadata: createAction<{
        name?: string
        symbol?: string
        decimals?: string
        uris?: Record<string, string>
        granularity?: string
    }>('tokenGatedRooms: setTokenMetadata'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(TokenGatedRoomAction.setTokenMetadata, (state, { payload }) => {
        state.tokenMetadata = payload
    })
})

export default reducer
