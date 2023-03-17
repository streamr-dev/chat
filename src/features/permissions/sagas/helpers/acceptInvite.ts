import { ToastType } from '$/components/Toast'
import { PermissionsAction } from '$/features/permissions'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller } from '$/features/toaster/helpers/toast'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import delegationPreflight from '$/utils/delegationPreflight'
import i18n from '$/utils/i18n'

export default function acceptInvite({
    roomId,
    member,
    requester,
}: ReturnType<typeof PermissionsAction.acceptInvite>['payload']) {
    return call(function* () {
        let tc: Controller | undefined

        let dismissToast = false

        try {
            const delegatedAccount = yield* delegationPreflight(requester)

            dismissToast = true

            tc = yield retoast(tc, {
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

            dismissToast = false

            tc = yield retoast(tc, {
                title: i18n('acceptInviteToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            dismissToast = false

            tc = yield retoast(tc, {
                title: i18n('acceptInviteToast.failureTitle'),
                type: ToastType.Error,
            })
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }
        }
    })
}
