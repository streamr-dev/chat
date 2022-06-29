import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import getDisplayUsername from '$/utils/getDisplayUsername'
import setMultiplePermissions from '$/utils/setMultiplePermissions'

function* onRemoveAction({
    payload: { roomId, member, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.remove>) {
    const displayName: string = yield getDisplayUsername(member)

    try {
        yield setMultiplePermissions(
            roomId,
            [
                {
                    user: member,
                    permissions: [],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success(
            <>
                <strong>{displayName}</strong> has gotten removed.
            </>
        )
    } catch (e) {
        handleError(e)

        error(
            <>
                Failed to remove <strong>{displayName}</strong>.
            </>
        )
    }
}

export default function* remove() {
    yield takeEveryUnique(MemberAction.remove, onRemoveAction)
}
