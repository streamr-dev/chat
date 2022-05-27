import { call } from 'redux-saga/effects'
import StreamrClient, { Stream } from 'streamr-client'
import { RoomId } from '../features/rooms/types'
import getWalletClientSaga from './getWalletClientSaga'

export default function* getStreamSaga(id: RoomId) {
    const client: StreamrClient = yield call(getWalletClientSaga)

    const stream: undefined | Stream = yield client.getStream(id)

    return stream
}
