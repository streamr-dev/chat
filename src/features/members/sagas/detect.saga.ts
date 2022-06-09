import { call, put, select, takeLatest } from 'redux-saga/effects'
import StreamrClient, { PermissionAssignment } from 'streamr-client'
import { EnhancedStream } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import { MembersAction } from '..'
import getWalletClient from '$/sagas/getWalletClient.saga'
import { IMember } from '$/features/members/types'
import { selectFetching } from '$/features/members/selectors'

function* onDetectAction({ payload: roomId }: ReturnType<typeof MembersAction.detect>) {
    let dirty = false

    try {
        const fetching: boolean = yield select(selectFetching(roomId))

        if (fetching) {
            return
        }

        yield put(
            MembersAction.setFetching({
                roomId,
                state: true,
            })
        )

        dirty = true

        const members: IMember[] = []

        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | EnhancedStream = yield getStream(client, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const assignments: PermissionAssignment[] = yield stream.getPermissions()

        for (const assignment of assignments) {
            if (!('user' in assignment) || !assignment.user) {
                // Skip `PublicPermissionAssignment` items.
                continue
            }

            if (!assignment.permissions.length) {
                continue
            }

            members.push({
                address: assignment.user,
                permissions: assignment.permissions,
            })
        }

        yield put(MembersAction.set({ roomId, members }))
    } catch (e) {
        handleError(e)
    } finally {
        if (dirty) {
            yield put(
                MembersAction.setFetching({
                    roomId,
                    state: false,
                })
            )
        }
    }
}

export default function* detect() {
    yield takeLatest(MembersAction.detect, onDetectAction)
}
