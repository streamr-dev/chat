import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { StreamPermission } from 'streamr-client'

function* onAcceptInviteAction({
    payload: { roomId, member, delegatedAddress, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.acceptInvite>) {
    try {
        yield setMultiplePermissions(
            roomId,
            [
                {
                    user: delegatedAddress,
                    permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                },
                {
                    user: member,
                    permissions: [
                        StreamPermission.GRANT,
                        StreamPermission.EDIT,
                        StreamPermission.PUBLISH,
                        StreamPermission.SUBSCRIBE,
                    ],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success('Invite accepted.')
    } catch (e) {
        handleError(e)

        error('Failed to accept an invite.')
    }
}

export default function* acceptInvite() {
    yield takeEveryUnique(MemberAction.acceptInvite, onAcceptInviteAction)
}
