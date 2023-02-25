import { TokenType } from '$/features/tokenGatedRooms/types'
import { Provider } from '@web3-react/types'
import { createAction } from '@reduxjs/toolkit'
import StreamrClient from 'streamr-client'
import { RoomId } from '$/features/room/types'

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
}
