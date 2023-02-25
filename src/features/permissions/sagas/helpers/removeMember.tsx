import { ToastType } from '$/components/Toast'
import { ZeroAddress } from '$/consts'
import { PermissionsAction } from '$/features/permissions'
import toast from '$/features/toaster/helpers/toast'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import getDisplayUsername from '$/utils/getDisplayUsername'
import handleError from '$/utils/handleError'
import isSameAddress from '$/utils/isSameAddress'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call } from 'redux-saga/effects'
import type { UserPermissionAssignment } from 'streamr-client'

export default function removeMember({
    roomId,
    member,
    provider,
    requester,
    streamrClient,
}: ReturnType<typeof PermissionsAction.removeMember>['payload']) {
    return call(function* () {
        const displayName: string = yield getDisplayUsername(member)

        try {
            const contract = getDelegatedAccessRegistry(provider)

            const [delegatedWallet]: string[] = yield contract.functions.mainToDelegatedWallets(
                member
            )

            const assignments: UserPermissionAssignment[] = [
                {
                    user: member,
                    permissions: [],
                },
            ]

            if (!isSameAddress(delegatedWallet, ZeroAddress)) {
                assignments.push({
                    user: delegatedWallet,
                    permissions: [],
                })
            }

            yield setMultiplePermissions(roomId, assignments, {
                provider,
                requester,
                streamrClient,
            })

            yield toast({
                title: (
                    <>
                        <strong>{displayName}</strong> has been removed
                    </>
                ),
                type: ToastType.Success,
            })
        } catch (e) {
            handleError(e)

            yield toast({
                title: (
                    <>
                        Failed to remove <strong>{displayName}</strong>
                    </>
                ),
                type: ToastType.Error,
            })
        }
    })
}
