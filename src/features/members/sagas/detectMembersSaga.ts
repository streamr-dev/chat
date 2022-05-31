import { call, put, takeLatest } from 'redux-saga/effects'
import StreamrClient, { PermissionAssignment, StreamPermission } from 'streamr-client'
import { EnhancedStream, PrivacySetting } from '../../../../types/common'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import getStream from '../../../utils/getStream'
import handleError from '../../../utils/handleError'
import { detectMembers, setMembers } from '../actions'
import { MemberAction } from '../types'

function* onDetectMembersAction({ payload: roomId }: ReturnType<typeof detectMembers>) {
    try {
        const members: string[] = []

        const client: StreamrClient = yield call(getWalletClientSaga)

        const stream: undefined | EnhancedStream = yield getStream(client, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const { privacy } = stream.extensions['thechat.eth']

        if (privacy !== PrivacySetting.Private && privacy !== PrivacySetting.ViewOnly) {
            return []
        }

        const assignments: PermissionAssignment[] = yield stream.getPermissions()

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
                        // Private and no `GRANT` nor `SUBSCRIBE` -> skip.
                        continue
                    }
                }
            }

            // `Public` privacy setting has already been eliminated before the `for…of` loop.

            members.push(assignment.user)
        }

        yield put(setMembers({ roomId, addresses: members }))
    } catch (e) {
        handleError(e)
    }
}

export default function* detectMembersSaga() {
    yield takeLatest(MemberAction.DetectMembers, onDetectMembersAction)
}
