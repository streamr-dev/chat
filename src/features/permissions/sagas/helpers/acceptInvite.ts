import { PermissionsAction } from '$/features/permissions'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

export default function acceptInvite({
    roomId,
    member,
    delegatedAddress,
    provider,
    requester,
    streamrClient,
}: ReturnType<typeof PermissionsAction.acceptInvite>['payload']) {
    return call(function* () {
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
    })
}
