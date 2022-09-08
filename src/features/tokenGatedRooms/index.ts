import {
    HexSerializedBigNumber,
    TokenERC1155Metadata,
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

const initialState: TokenGatedRoomState = {
    selectedRoomId: undefined,
    tokenType: TokenTypes.unknown,
    tokenAddress: undefined,
    tokenId: undefined,
    minTokenAmount: undefined,
    tokenMetadata: undefined,
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
        tokenId: HexSerializedBigNumber
        streamrClient: StreamrClient
    }>('tokenGatedRooms: join'),

    getTokenMetadata: createAction<{
        tokenAddress: Address
        tokenType: TokenType
        tokenId?: HexSerializedBigNumber
        provider: Provider
    }>('tokenGatedRooms: getTokenMetadata'),

    setTokenMetadata: createAction<TokenERC20Metadata | TokenERC721Metadata | TokenERC1155Metadata>(
        'tokenGatedRooms: setTokenMetadata'
    ),
}

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(TokenGatedRoomAction.registerPolicy, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.join, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.getTokenMetadata, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.setTokenMetadata, (state, action) => {
        state.tokenMetadata = action.payload
    })
})

export function* tokenGatedRoomSaga() {
    yield all([registerPolicy(), getTokenMetadata()])
}

export default reducer
