import {
    HexSerializedBigNumber,
    TokenERC20Metadata,
    TokenERC721Metadata,
    TokenGatedRoomState,
    TokenType,
    TokenTypes,
} from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { Provider } from '@web3-react/types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import getTokenMetadata from '$/features/tokenGatedRooms/sagas/getTokenMetadata.saga'
import { RoomId } from '$/features/room/types'
import registerPolicy from '$/features/tokenGatedRooms/sagas/registerPolicy.saga'
import join from '$/features/tokenGatedRooms/sagas/join.saga'

const initialState: TokenGatedRoomState = {
    tokenType: TokenTypes.unknown,
    tokenAddress: undefined,
    tokenId: undefined,
    minTokenAmount: undefined,
    erc20Metadata: undefined,
}

export const TokenGatedRoomAction = {
    registerPolicy: createAction<{
        owner: Address
        tokenAddress: string
        roomId: RoomId
        tokenType: TokenType
        minTokenAmount?: number
        tokenId?: HexSerializedBigNumber
        provider: Provider
        streamrClient: StreamrClient
    }>('tokenGatedRooms: registerPolicy'),

    join: createAction<{
        roomId: RoomId
        owner: Address
        tokenAddress: Address
        provider: Provider
        delegatedAccount: Address
        tokenType: TokenType
        tokenId?: HexSerializedBigNumber
    }>('tokenGatedRooms: join'),

    getTokenMetadata: createAction<{
        tokenAddress: Address
        tokenType: TokenType
        tokenId?: HexSerializedBigNumber
        provider: Provider
    }>('tokenGatedRooms: getTokenMetadata'),

    setERC20Metadata: createAction<TokenERC20Metadata>('tokenGatedRooms: setERC20Metadata'),
    setERC721Metadata: createAction<TokenERC721Metadata>('tokenGatedRooms: setERC721Metadata'),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(TokenGatedRoomAction.registerPolicy, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.join, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.getTokenMetadata, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.setERC20Metadata, (state, action) => {
        state.erc20Metadata = action.payload
    })

    builder.addCase(TokenGatedRoomAction.setERC721Metadata, (state, action) => {
        state.erc721Metadata = action.payload
    })
})

export function* tokenGatedRoomSaga() {
    yield all([registerPolicy(), getTokenMetadata(), join()])
}

export default reducer
