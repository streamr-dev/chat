import { PermissionsAction } from '$/features/permissions'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address, EnhancedStream } from '$/types'
import getStreamMetadata from '$/utils/getStreamMetadata'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put } from 'redux-saga/effects'

export default function tokenGatedPromoteDelegatedAccount({
    roomId,
    delegatedAddress,
    provider,
    streamrClient,
}: ReturnType<typeof PermissionsAction.promoteDelegatedAccount>['payload']) {
    return call(function* () {
        try {
            const requester: Address = yield streamrClient.getAddress()

            const stream: EnhancedStream = yield streamrClient.getStream(roomId)

            const { tokenAddress } = getStreamMetadata(stream)

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
