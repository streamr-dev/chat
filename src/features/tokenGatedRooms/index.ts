import { TokenGatedRoomState, TokenType, TokenTypes } from '$/features/tokenGatedRooms/types'
import { Address } from '$/types'
import { SEE_SAGA } from '$/utils/consts'
import { Provider } from '@web3-react/types'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects'
import StreamrClient, { BigNumber } from 'streamr-client'
import registerERC20Policy from '$/features/tokenGatedRooms/sagas/registerERC20Policy.saga'
import joinERC20 from '$/features/tokenGatedRooms/sagas/joinERC20.saga'
import getTokenMetadata from '$/features/tokenGatedRooms/sagas/getTokenMetadata.saga'
import { RoomId } from '$/features/room/types'

const initialState: TokenGatedRoomState = {
    selectedRoomId: undefined,
    tokenType: TokenTypes.unknown,
    tokenAddress: undefined,
    tokenId: undefined,
    minTokenAmount: undefined,
    erc20Metadata: undefined,
}

export const TokenGatedRoomAction = {
    registerERC20Policy: createAction<{
        owner: Address
        tokenAddress: string
        roomId: RoomId
        minTokenAmount: number
        provider: Provider
        streamrClient: StreamrClient
    }>('tokenGatedRooms: registerERC20Policy'),

    joinERC20: createAction<{
        roomId: RoomId
        owner: Address
        tokenAddress: Address
        provider: Provider
        delegatedAccount: Address
    }>('tokenGatedRooms: joinERC20'),

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
    builder.addCase(TokenGatedRoomAction.registerERC20Policy, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.joinERC20, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.getTokenMetadata, SEE_SAGA)

    builder.addCase(TokenGatedRoomAction.setERC20Metadata, (state, action) => {
        state.erc20Metadata = action.payload
    })
})

export function* tokenGatedRoomSaga() {
    yield all([registerERC20Policy(), joinERC20(), getTokenMetadata()])
}

export default reducer
