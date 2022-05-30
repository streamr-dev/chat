import db from '../../../utils/db'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createRoom, RoomAction, selectRoom } from '../actions'
import StreamrClient, { Stream } from 'streamr-client'
import handleError from '../../../utils/handleError'
import preflight from '../../../utils/preflight'
import { Provider } from '@web3-react/types'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import { Address } from '../../../../types/common'
import createRoomStream from '../../../utils/createRoomStream'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'

function* onCreateRoomAction({ payload: { owner, ...payload } }: ReturnType<typeof createRoom>) {
    try {
        const provider: Provider = yield call(getWalletProviderSaga)

        const account: Address = yield call(getWalletAccountSaga)

        yield preflight({
            provider,
            address: account,
        })

        const client: StreamrClient = yield call(getWalletClientSaga)

        // `payload.id` is a partial room id. The real room id gets constructed by the
        // client from the given value and the account address that creates the stream.
        const stream: Stream = yield createRoomStream(client, payload)

        yield db.rooms.add({
            ...payload,
            id: stream.id,
            owner: owner.toLowerCase(),
        })

        // Select newly created room.
        yield put(selectRoom(stream.id))
    } catch (e) {
        handleError(e)
    }
}

export default function* createRoomSaga() {
    yield takeEvery(RoomAction.CreateRoom, onCreateRoomAction)
}
