import { ToastType } from '$/components/Toast'
import { PermissionsAction } from '$/features/permissions'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call, cancelled } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import delegationPreflight from '$/utils/delegationPreflight'
import i18n from '$/utils/i18n'
import retoast from '$/features/misc/helpers/retoast'
import { Address } from '$/types'

export default function acceptInvite({
    roomId,
    member,
    requester,
}: ReturnType<typeof PermissionsAction.acceptInvite>['payload']) {
    return call(function* () {
        const toast = retoast()

        try {
            const delegatedAccount: Address = yield delegationPreflight(requester)

            yield toast.pop({
                title: i18n('acceptInviteToast.joiningTitle'),
                type: ToastType.Processing,
            })

            yield setMultiplePermissions(
                roomId,
                [
                    {
                        user: delegatedAccount,
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
                    requester,
                }
            )

            yield toast.pop({
                title: i18n('acceptInviteToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast.pop({
                title: i18n('acceptInviteToast.failureTitle'),
                type: ToastType.Error,
            })
        } finally {
            toast.discard({ asap: yield cancelled() })
        }
    })
}
