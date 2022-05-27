import { call } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamProperties } from 'streamr-client'
import { IRoom } from '../features/rooms/types'
import getWalletClientSaga from './getWalletClientSaga'

export default function* createStreamSaga({
    id,
    name: description,
    ...metadata
}: IRoom) {
    const client: StreamrClient = yield call(getWalletClientSaga)

    const stream: Stream = yield client.createStream({
        id,
        description,
        extensions: {
            'thechat.eth': metadata,
        },
    } as StreamProperties)

    return stream
}
