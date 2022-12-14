import { TokenGatedRoomState, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { Provider } from '@web3-react/types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import StreamrClient, { BigNumber } from 'streamr-client'
import { RoomId } from '$/features/room/types'
import join from '$/features/tokenGatedRooms/sagas/join.saga'
import create from '$/features/tokenGatedRooms/sagas/create.saga'
import getTokenMetadata from '$/features/tokenGatedRooms/sagas/getTokenMetadata.saga'

const initialState: TokenGatedRoomState = {
    tokenType: TokenTypes.unknown,
    tokenAddress: undefined,
    tokenId: undefined,
    minTokenAmount: undefined,
    erc20Metadata: undefined,
}

export const TokenGatedRoomAction = {
    create: createAction<{
        owner: Address
        tokenAddress: string
        tokenType: TokenType
        roomId: RoomId
        minRequiredBalance?: number
        tokenId?: number
        stakingEnabled: boolean
        provider: Provider
        streamrClient: StreamrClient
    }>('tokenGatedRooms: create'),

    join: createAction<{
        tokenAddress: string
        tokenType: TokenType
        roomId: RoomId
        tokenId: number
        stakingEnabled: boolean
        provider: Provider
    }>('tokenGatedRooms: join'),

    getTokenMetadata: createAction<{
        tokenAddress: Address
        tokenType: TokenType
        provider: Provider
    }>('tokenGatedRooms: getTokenMetadata'),

    setERC20Metadata: createAction<{
        name: string
        symbol: string
        decimals: BigNumber
    }>('tokenGatedRooms: setERC20Metadata'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(TokenGatedRoomAction.create, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.join, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.getTokenMetadata, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.setERC20Metadata, (state, action) => {
        state.erc20Metadata = action.payload
    })
})

export function* tokenGatedRoomSaga() {
    yield all([create(), join(), getTokenMetadata()])
}

export default reducer
