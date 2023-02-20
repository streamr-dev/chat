import Toast, { ToastType } from '$/components/Toast'
import retrieve from '$/features/delegation/helpers/retrieve'
import { selectDelegatedAccount } from '$/features/delegation/selectors'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import retoast from '$/features/toaster/helpers/retoast'
import { Controller } from '$/features/toaster/helpers/toast'
import toaster from '$/features/toaster/helpers/toaster'
import { Address, OptionalAddress } from '$/types'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call, put, select } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { Controller as ToastController } from '$/components/Toaster'

export default function acceptInvite({
    roomId,
    member,
    provider,
    requester,
    streamrClient,
}: ReturnType<typeof PermissionsAction.acceptInvite>['payload']) {
    return call(function* () {
        let retrievedAccess = false

        let tc: Controller | undefined

        let confirm: ToastController<typeof Toast> | undefined

        let dismissToast = false

        try {
            let delegatedAccount: OptionalAddress = yield select(selectDelegatedAccount)

            if (!delegatedAccount) {
                dismissToast = true

                tc = yield retoast(tc, {
                    title: 'Joining room…',
                    type: ToastType.Processing,
                })

                confirm = yield toaster({
                    title: 'Hot wallet required',
                    type: ToastType.Warning,
                    desc: 'In order to join this room the app will ask for your signature.',
                    okLabel: 'Ok',
                    cancelLabel: 'Cancel',
                })

                yield confirm?.open()

                retrievedAccess = true

                yield put(FlagAction.set(Flag.isAccessBeingDelegated(requester)))

                delegatedAccount = (yield retrieve({ provider, owner: requester })) as Address
            }

            dismissToast = true

            tc = yield retoast(tc, {
                title: 'Setting new permissions…',
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
                    provider,
                    requester,
                    streamrClient,
                }
            )

            dismissToast = false

            tc = yield retoast(tc, {
                title: 'Joined successfully',
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            dismissToast = false

            tc = yield retoast(tc, {
                title: 'Failed to join',
                type: ToastType.Error,
            })
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }

            confirm?.dismiss()

            if (retrievedAccess) {
                yield put(FlagAction.unset(Flag.isAccessBeingDelegated(requester)))
            }
        }
    })
}
