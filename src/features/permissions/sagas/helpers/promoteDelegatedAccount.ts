import { ToastType } from '$/components/Toast'
import { PermissionsAction } from '$/features/permissions'
import toast from '$/features/toaster/helpers/toast'
import { Address } from '$/types'
import handleError from '$/utils/handleError'
import { I18n } from '$/utils/I18n'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

export default function promoteDelegatedAccount({
    roomId,
    delegatedAddress,
    provider,
    streamrClient,
}: ReturnType<typeof PermissionsAction.promoteDelegatedAccount>['payload']) {
    return call(function* () {
        try {
            const requester: Address = yield streamrClient.getAddress()

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

            yield toast({
                title: I18n.promoteToast.successTitle(),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast({
                title: I18n.promoteToast.failureTitle(),
                type: ToastType.Error,
            })
        }
    })
}
