import { Provider } from '@web3-react/types'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { RoomAction } from '..'
import { Address } from '$/types'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import getWalletClient from '$/sagas/getWalletClient.saga'
import getWalletProvider from '$/sagas/getWalletProvider.saga'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { selectIsBeingDeleted } from '$/features/room/selectors'
import { error, success } from '$/utils/toaster'

function* onDeleteAction({ payload: roomId }: ReturnType<typeof RoomAction.delete>) {
    let dirty = false

    try {
        const isBeingDeleted: boolean = yield select(selectIsBeingDeleted(roomId))

        if (isBeingDeleted) {
            error('Room is already being deleted.')
            return
        }

        yield put(RoomAction.setOngoingDeletion({ roomId, state: true }))

        dirty = true

        const provider: Provider = yield call(getWalletProvider)

        const account: Address = yield call(getWalletAccount)

        yield preflight({
            provider,
            address: account,
        })

        const client: StreamrClient = yield call(getWalletClient)

        yield client.deleteStream(roomId)

        yield put(RoomAction.deleteLocal(roomId))

        success('Room has been deleted.')
    } catch (e) {
        handleError(e)

        error('Failed to delete room.')
    } finally {
        if (dirty) {
            yield put(RoomAction.setOngoingDeletion({ roomId, state: false }))
        }
    }
}

export default function* del() {
    yield takeEvery(RoomAction.delete, onDeleteAction)
}
