import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import getRoomMetadata from '$/utils/getRoomMetadata'
import handleError from '$/utils/handleError'
import { call, put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function tokenGatedPromoteDelegatedAccount({
    roomId,
    provider,
    streamrClient,
}: ReturnType<typeof PermissionsAction.tokenGatedPromoteDelegatedAccount>['payload']) {
    return call(function* () {
        try {
            const stream: null | Stream = yield streamrClient.getStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const {
                tokenAddress,
                tokenIds,
                tokenType,
                stakingEnabled = false,
            } = getRoomMetadata(stream)

            if (!tokenAddress || tokenIds == null || !tokenType) {
                throw new Error(
                    `Missing token info on stream metadata: ${JSON.stringify({
                        tokenAddress,
                        tokenIds,
                        tokenType,
                    })}`
                )
            }

            yield put(
                TokenGatedRoomAction.join({
                    roomId,
                    tokenAddress,
                    provider,
                    tokenType,
                    stakingEnabled,
                })
            )
        } catch (e) {
            handleError(e)
        }
    })
}
