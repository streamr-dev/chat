import { MemberAction } from '$/features/member'
import { TokenGatedRoomAction } from '$/features/tokenGatedRooms'
import { Address, EnhancedStream, PrivacySetting } from '$/types'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { put } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

function* onPromoteDelegatedAccountAction({
    payload: { roomId, delegatedAddress, provider, streamrClient, privacy },
}: ReturnType<typeof MemberAction.promoteDelegatedAccount>) {
    try {
        const requester: Address = yield streamrClient.getAddress()

        // split for token-gated rooms
        if (privacy === PrivacySetting.TokenGated) {
            console.log('promoting token gated room')
            const stream: EnhancedStream = yield streamrClient.getStream(roomId)
            const metadata = stream.extensions['thechat.eth']

            if (!metadata.tokenAddress) {
                throw new Error('No token address found')
            }

            yield put(
                TokenGatedRoomAction.joinERC20({
                    roomId,
                    owner: requester,
                    tokenAddress: metadata.tokenAddress,
                    provider,
                    delegatedAccount: delegatedAddress,
                })
            )
            return
        }

        yield setMultiplePermissions(
            roomId,
            [
                {
                    user: delegatedAddress,
                    permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success('Delegated account has been promoted.')
    } catch (e) {
        handleError(e)

        error('Failed to promote the delegated account.')
    }
}

export default function* promoteDelegatedAccount() {
    yield takeEveryUnique(MemberAction.promoteDelegatedAccount, onPromoteDelegatedAccountAction)
}
