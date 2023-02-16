import { ToastType } from '$/components/Toast'
import { PermissionsAction } from '$/features/permissions'
import toast from '$/features/toaster/helpers/toast'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
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

            yield toast({
                title: 'Invite accepted',
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast({
                title: 'Failed to accept an invite',
                type: ToastType.Error,
            })
        }
    })
}
