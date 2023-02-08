import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address } from '$/types'
import getRoomMetadata from '$/utils/getRoomMetadata'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'

export default function tokenGatedPromoteDelegatedAccount({
    roomId,
    delegatedAddress,
    provider,
    streamrClient,
}: ReturnType<typeof PermissionsAction.promoteDelegatedAccount>['payload']) {
    return call(function* () {
        try {
            const requester: Address = yield streamrClient.getAddress()

            const stream: null | Stream = yield streamrClient.getStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const { tokenAddress } = getRoomMetadata(stream)

            if (!tokenAddress) {
                throw new Error('No token address found')
            }

            yield put(
                TokenGatedRoomAction.joinERC20({
                    roomId,
                    owner: requester,
                    tokenAddress: tokenAddress,
                    provider,
                    delegatedAccount: delegatedAddress,
                })
            )

            success('Delegated account has been promoted on the TokenGated room.')
        } catch (e) {
            handleError(e)

            error('Failed to promote the delegated account.')
        }
    })
}
