import { call, put, takeLatest } from 'redux-saga/effects'
import { PermissionAssignment, StreamPermission } from 'streamr-client'
import { EnhancedStream, PrivacySetting } from '../../../../types/common'
import getStreamSaga from '../../../sagas/getStreamSaga'
import { detectMembers, MemberAction, setMembers } from '../actions'

// eslint-disable-next-line @typescript-eslint/no-empty-function
function* onDetectMembersAction({
    payload: roomId,
}: ReturnType<typeof detectMembers>) {
    try {
        const members: string[] = []

        const stream: EnhancedStream = yield call(getStreamSaga, roomId)

        const { privacy } = stream.extensions['thechat.eth']

        if (
            privacy !== PrivacySetting.Private &&
            privacy !== PrivacySetting.ViewOnly
        ) {
            return []
        }

        const assignments: PermissionAssignment[] =
            yield stream.getPermissions()

        for (const assignment of assignments) {
            if (!('user' in assignment) || !assignment.user) {
                // Skip `PublicPermissionAssignment` items.
                continue
            }

            const { permissions } = assignment

            if (privacy === PrivacySetting.ViewOnly) {
                if (!permissions.includes(StreamPermission.PUBLISH)) {
                    // ViewOnly and no `PUBLISH` -> skip.
                    continue
                }
            }

            if (privacy === PrivacySetting.Private) {
                if (!permissions.includes(StreamPermission.GRANT)) {
                    if (!permissions.includes(StreamPermission.SUBSCRIBE)) {
                        // Private and no `GRANT` and no `SUBSCRIBE` -> skip.
                        continue
                    }
                }
            }

            // `Public` privacy setting has already been eliminated before the `for…of` loop.

            members.push(assignment.user)
        }

        yield put(setMembers([roomId, members]))
    } catch (e) {
        console.warn('Detection failed.', e)
    }
}

export default function* detectMembersSaga() {
    yield takeLatest(MemberAction.DetectMembers, onDetectMembersAction)
}
