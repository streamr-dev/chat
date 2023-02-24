import { TokenGate, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { Provider } from '@web3-react/types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { RoomId } from '$/features/room/types'
import getTokenMetadata from '$/features/tokenGatedRooms/sagas/getTokenMetadata.saga'
import { BigNumber } from 'ethers'

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
    }>('tokenGatedRooms: join'),

    promoteDelegatedAccount: createAction<{
        roomId: RoomId
        provider: Provider
        streamrClient: StreamrClient
    }>('tokenGatedRooms: promoteDelegatedAccount'),

    getTokenMetadata: createAction<{
        tokenAddress: Address
        tokenIds: string[]
        tokenType: TokenType
        provider: Provider
    }>('tokenGatedRooms: getTokenMetadata'),

    setTokenMetadata: createAction<{
        name?: string
        symbol?: string
        decimals?: string
        uri?: string
        granularity?: string
    }>('tokenGatedRooms: setTokenMetadata'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(TokenGatedRoomAction.getTokenMetadata, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.setTokenMetadata, (state, action) => {
        state.tokenMetadata = {
            name: action.payload.name,
            symbol: action.payload.symbol,
            decimals: BigNumber.from(action.payload.decimals),
            uri: action.payload.uri,
            granularity: BigNumber.from(action.payload.granularity),
        }
    })
})

export function* tokenGatedRoomSaga() {
    yield all([getTokenMetadata()])
}

export default reducer
