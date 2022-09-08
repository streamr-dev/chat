import { MemberAction } from '$/features/member'
import joinTokenGatedRoom from '$/features/tokenGatedRooms/utils/joinTokenGatedRoom'
import { Address, EnhancedStream, PrivacySetting } from '$/types'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { StreamPermission } from 'streamr-client'

function* onPromoteDelegatedAccountAction({
    payload: { roomId, delegatedAddress, provider, requester, streamrClient, privacy },
}: ReturnType<typeof MemberAction.promoteDelegatedAccount>) {
    try {
        if (privacy === PrivacySetting.TokenGated) {
            const stream: EnhancedStream = yield streamrClient.getStream(roomId)
            const metadata = stream.extensions['thechat.eth']

            if (!metadata.tokenAddress || !metadata.tokenType) {
                throw new Error('No token address found')
            }

            const owner: Address = yield streamrClient.getAddress()

            yield joinTokenGatedRoom(
                roomId,
                owner,
                metadata.tokenAddress,
                provider,
                delegatedAddress,
                metadata.tokenType,
                metadata.tokenId!,
                streamrClient
            )
        } else {
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
        }

        success('Delegated account has been promoted.')
    } catch (e) {
        handleError(e)

        error('Failed to promote the delegated account.')
    }
}

export default function* promoteDelegatedAccount() {
    yield takeEveryUnique(MemberAction.promoteDelegatedAccount, onPromoteDelegatedAccountAction)
}
