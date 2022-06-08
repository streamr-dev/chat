import { call, put, takeLatest } from 'redux-saga/effects'
import StreamrClient, { PermissionAssignment, Stream, StreamPermission } from 'streamr-client'
import { Address } from '../../../../types/common'
import getStream from '../../../utils/getStream'
import handleError from '../../../utils/handleError'
import { RoomAction } from '..'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import isSameAddress from '../../../utils/isSameAddress'

async function getUserPermissions(user: Address, stream: Stream) {
    const assignments: PermissionAssignment[] = await stream.getPermissions()

    const assignment = assignments.find(
        (assignment) => 'user' in assignment && isSameAddress(assignment.user, user)
    )

    return assignment ? assignment.permissions : []
}

function* onSyncAction({ payload: roomId }: ReturnType<typeof RoomAction.sync>) {
    try {
        const client: StreamrClient = yield call(getWalletClient)

        const account: Address = yield call(getWalletAccount)

        const stream: undefined | Stream = yield getStream(client, roomId)

        if (stream) {
            const permissions: StreamPermission[] = yield getUserPermissions(account, stream)

            if (permissions.length) {
                yield put(
                    RoomAction.renameLocal({
                        roomId,
                        name: stream.description || '',
                    })
                )

                return
            }
        }

        // At this point we know that the stream isn't there, or we don't have anything to do with
        // it (no explicit permissions). Let's remove it from the navigation sidebar.

        yield put(RoomAction.deleteLocal(roomId))
    } catch (e) {
        handleError(e)
    }
}

export default function* sync() {
    yield takeLatest(RoomAction.sync, onSyncAction)
}
