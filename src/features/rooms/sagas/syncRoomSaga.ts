import { call, select, takeLatest } from 'redux-saga/effects'
import { PermissionAssignment, Stream, StreamPermission } from 'streamr-client'
import { Address } from '../../../../types/common'
import MissingWalletAccountError from '../../../errors/MissingWalletAccountError'
import getStreamSaga from '../../../sagas/getStreamSaga'
import { selectWalletAccount } from '../../wallet/selectors'
import { WalletState } from '../../wallet/types'
import { RoomAction, syncRoom } from '../actions'
import deleteLocalRoomSaga from './deleteLocalRoomSaga'
import renameLocalRoomSaga from './renameLocalRoomSaga'

async function getUserPermissions(user: Address, stream: Stream) {
    const assignments: PermissionAssignment[] = await stream.getPermissions()

    const assignment = assignments.find(
        (assignment) => 'user' in assignment && assignment.user.toLowerCase() === user.toLowerCase()
    )

    return assignment ? assignment.permissions : []
}

function* onSyncRoomAction({ payload: roomId }: ReturnType<typeof syncRoom>) {
    try {
        const stream: undefined | Stream = yield call(getStreamSaga, roomId)

        const account: WalletState['account'] = yield select(selectWalletAccount)

        if (!account) {
            // No current account? Fail. It's not a shame.
            throw new MissingWalletAccountError()
        }

        if (stream) {
            const permissions: StreamPermission[] = yield getUserPermissions(account, stream)

            if (permissions.length) {
                yield call(renameLocalRoomSaga, roomId, stream.description || '')
                return
            }
        }

        // At this point we know that the stream isn't there, or we don't have anything to do with
        // it (no explicit permissions). Let's remove it from the navigation sidebar.

        yield call(deleteLocalRoomSaga, roomId, account.toLowerCase())
    } catch (e) {
        console.warn('Oh no, `onSyncRoomAction` failed.', e)
    }
}

export default function* syncRoomSaga() {
    yield takeLatest(RoomAction.SyncRoom, onSyncRoomAction)
}
