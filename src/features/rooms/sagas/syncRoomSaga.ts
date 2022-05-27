import { call, select, takeLatest } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import MissingWalletAccountError from '../../../errors/MissingWalletAccountError'
import getStreamSaga from '../../../sagas/getStreamSaga'
import { selectWalletAccount } from '../../wallet/selectors'
import { WalletState } from '../../wallet/types'
import { RoomAction, syncRoom } from '../actions'
import deleteLocalRoomSaga from './deleteLocalRoomSaga'
import renameLocalRoomSaga from './renameLocalRoomSaga'

function* onSyncRoomAction({ payload: roomId }: ReturnType<typeof syncRoom>) {
    try {
        const stream: undefined | Stream = yield call(getStreamSaga, roomId)

        if (stream) {
            yield call(renameLocalRoomSaga, roomId, stream.description || '')
            return
        }

        // At this point we know the stream isn't there. Let's drop if for the local database for
        // the current account.

        const account: WalletState['account'] = yield select(
            selectWalletAccount
        )

        if (!account) {
            // No current account? Fail. It's not a shame.
            throw new MissingWalletAccountError()
        }

        yield call(deleteLocalRoomSaga, roomId, account.toLowerCase())
    } catch (e) {
        console.warn('Oh no, `onSyncRoomAction` failed.', e)
    }
}

export default function* syncRoomSaga() {
    yield takeLatest(RoomAction.SyncRoom, onSyncRoomAction)
}
