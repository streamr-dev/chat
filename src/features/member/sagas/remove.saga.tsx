import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import getDisplayUsername from '$/utils/getDisplayUsername'
import setMultiplePermissions from '$/utils/setMultiplePermissions'
import getDelegatedAccessRegistry from '$/utils/getDelegatedAccessRegistry'
import { UserPermissionAssignment } from 'streamr-client'

function* onRemoveAction({
    payload: { roomId, member, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.remove>) {
    const displayName: string = yield getDisplayUsername(member)

    try {
        const contract = getDelegatedAccessRegistry(provider)

        const [delegatedWallet]: string[] = yield contract.functions.mainToDelegatedWallets(member)

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
}

export default function* remove() {
    yield takeEveryUnique(MemberAction.remove, onRemoveAction)
}
