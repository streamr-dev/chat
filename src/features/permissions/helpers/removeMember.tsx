import { ToastType } from '$/components/Toast'
import { ZeroAddress } from '$/consts'
import { PermissionsAction } from '$/features/permissions'
import { ToasterAction } from '$/features/toaster'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import getDisplayUsername from '$/utils/getDisplayUsername'
import getWalletProvider from '$/utils/getWalletProvider'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import isSameAddress from '$/utils/isSameAddress'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import { call, put } from 'redux-saga/effects'
import type { UserPermissionAssignment } from 'streamr-client'

export default function removeMember({
    roomId,
    member,
    requester,
}: ReturnType<typeof PermissionsAction.removeMember>['payload']) {
    return call(function* () {
        const displayName: string = yield getDisplayUsername(member)

        try {
            const provider = yield* getWalletProvider()

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
                requester,
            })

            yield put(
                ToasterAction.show({
                    title: i18n('removeMemberToast.successTitle', displayName),
                    type: ToastType.Success,
                })
            )
        } catch (e) {
            handleError(e)

            yield put(
                ToasterAction.show({
                    title: i18n('removeMemberToast.failureTitle', displayName),
                    type: ToastType.Error,
                })
            )
        }
    })
}