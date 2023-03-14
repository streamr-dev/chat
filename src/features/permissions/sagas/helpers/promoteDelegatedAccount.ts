import { ToastType } from '$/components/Toast'
import { PermissionsAction } from '$/features/permissions'
import toast from '$/features/toaster/helpers/toast'
import { Address } from '$/types'
import getWalletProvider from '$/utils/getWalletProvider'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

export default function promoteDelegatedAccount({
    roomId,
    delegatedAddress,
    streamrClient,
}: ReturnType<typeof PermissionsAction.promoteDelegatedAccount>['payload']) {
    return call(function* () {
        try {
            const requester: Address = yield streamrClient.getAddress()

            const provider = yield* getWalletProvider()

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
                title: i18n('promoteToast.successTitle'),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast({
                title: i18n('promoteToast.failureTitle'),
                type: ToastType.Error,
            })
        }
    })
}
