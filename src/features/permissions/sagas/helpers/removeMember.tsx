import { PermissionsAction } from '$/features/permissions'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import getDisplayUsername from '$/utils/getDisplayUsername'
import handleError from '$/utils/handleError'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { error, success } from '$/utils/toaster'
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

            if (!/^0x0{40}$/i.test(delegatedWallet)) {
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

            success(
                <>
                    <strong>{displayName}</strong> has been removed
                </>
            )
        } catch (e) {
            handleError(e)

            error(
                <>
                    Failed to remove <strong>{displayName}</strong>
                </>
            )
        }
    })
}
