import { ToastType } from '$/components/Toast'
import { ZeroAddress } from '$/consts'
import { MiscAction } from '$/features/misc'
import { PermissionsAction } from '$/features/permissions'
import { getJsonRpcProvider } from '$/utils'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import getDisplayUsername from '$/utils/getDisplayUsername'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import isSameAddress from '$/utils/isSameAddress'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import type { UserPermissionAssignment } from '@streamr/sdk'
import { call, put } from 'redux-saga/effects'

export default function removeMember({
    roomId,
    member,
    requester,
}: ReturnType<typeof PermissionsAction.removeMember>['payload']) {
    return call(function* () {
        const displayName: string = yield getDisplayUsername(member)

        try {
            const contract = getDelegatedAccessRegistry(getJsonRpcProvider())

            const [delegatedWallet]: string[] = yield contract.functions.mainToDelegatedWallets(
                member
            )

            const assignments: UserPermissionAssignment[] = [
                {
                    userId: member,
                    permissions: [],
                },
            ]

            if (!isSameAddress(delegatedWallet, ZeroAddress)) {
                assignments.push({
                    userId: delegatedWallet,
                    permissions: [],
                })
            }

            yield setMultiplePermissions(roomId, assignments, {
                requester,
            })

            yield put(
                MiscAction.toast({
                    title: i18n('removeMemberToast.successTitle', displayName),
                    type: ToastType.Success,
                })
            )
        } catch (e) {
            handleError(e)

            yield put(
                MiscAction.toast({
                    title: i18n('removeMemberToast.failureTitle', displayName),
                    type: ToastType.Error,
                })
            )
        }
    })
}
