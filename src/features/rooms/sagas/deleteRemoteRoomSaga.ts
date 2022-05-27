import { call } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import getWalletClientSaga from '../../../sagas/getWalletClientSaga'
import { RoomId } from '../types'

export default function* deleteRemoteRoomSaga(id: RoomId) {
    const client: StreamrClient = yield call(getWalletClientSaga)

    yield client.deleteStream(id)
}
