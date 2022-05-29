import { call } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import getWalletClientSaga from '../../../sagas/getWalletClientSaga'
import web3PreflightSaga from '../../../sagas/web3PreflightSaga'
import { RoomId } from '../types'

export default function* deleteRemoteRoomSaga(id: RoomId) {
    yield call(web3PreflightSaga)

    const client: StreamrClient = yield call(getWalletClientSaga)

    yield client.deleteStream(id)
}
