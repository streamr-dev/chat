import { MemberAction } from '$/features/member'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put } from 'redux-saga/effects'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import takeEveryUnique from '$/utils/takeEveryUnique'
import getDisplayUsername from '$/utils/getDisplayUsername'
import { Flag } from '$/features/flag/types'
import { MembersAction } from '$/features/members'

function* onRemoveAction({
    payload: { roomId, member, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.remove>) {
    const displayName: string = yield getDisplayUsername(member)

    try {
        yield call(
            setMultiplePermissions,
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

        yield put(
            MembersAction.detect({
                roomId,
                streamrClient,
                fingerprint: Flag.isDetectingMembers(roomId),
            })
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
