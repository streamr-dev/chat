import { ToastType } from '$/components/Toast'
import retrieve from '$/features/delegation/helpers/retrieve'
import { selectDelegatedAccount } from '$/features/delegation/selectors'
import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import retoast from '$/features/toaster/helpers/retoast'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { Address, OptionalAddress } from '$/types'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call, put, select } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

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

        let dismissToast = false

        try {
            let delegatedAccount: OptionalAddress = yield select(selectDelegatedAccount)

            if (!delegatedAccount) {
                dismissToast = true

                tc = yield retoast(tc, {
                    title: 'Retrieving hot wallet…',
                    type: ToastType.Processing,
                })

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
                title: 'Invite accepted',
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            dismissToast = false

            tc = yield retoast(tc, {
                title: 'Failed to accept an invite',
                type: ToastType.Error,
            })
        } finally {
            if (dismissToast) {
                tc?.dismiss()
            }

            if (retrievedAccess) {
                yield put(FlagAction.unset(Flag.isAccessBeingDelegated(requester)))
            }
        }
    })
}
