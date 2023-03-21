import { ToastType } from '$/components/Toast'
import { PermissionsAction } from '$/features/permissions'
import { ToasterAction } from '$/features/toaster'
import { selectWalletAccount } from '$/features/wallet/selectors'
import { Address } from '$/types'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call, put, select } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

export default function promoteDelegatedAccount({
    roomId,
    delegatedAddress,
}: ReturnType<typeof PermissionsAction.promoteDelegatedAccount>['payload']) {
    return call(function* () {
        try {
            const requester: Address = yield select(selectWalletAccount)

            yield setMultiplePermissions(
                roomId,
                [
                    {
                        user: delegatedAddress,
                        permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                    },
                ],
                {
                    requester,
                }
            )

            yield put(
                ToasterAction.show({
                    title: i18n('promoteToast.successTitle'),
                    type: ToastType.Success,
                })
            )
        } catch (e) {
            handleError(e)

            yield put(
                ToasterAction.show({
                    title: i18n('promoteToast.failureTitle'),
                    type: ToastType.Error,
                })
            )
        }
    })
}
