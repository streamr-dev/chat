import { call } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import getStreamSaga from '../../../sagas/getStreamSaga'
import { IRoom, RoomId } from '../types'

type StreamWithExtensions = Stream & {
    extensions?: {
        'thechat.eth'?: Omit<IRoom, 'id' | 'name' | 'owner'>
    }
}

export default function* renameRemoteRoomSaga(id: RoomId, name: string) {
    const stream: StreamWithExtensions = yield call(getStreamSaga, id)

    if (!stream.extensions) {
        stream.extensions = {}
    }

    if (!stream.extensions['thechat.eth']) {
        stream.extensions['thechat.eth'] = {}
    }

    stream.description = name

    stream.extensions['thechat.eth'].updatedAt = Date.now()

    yield stream.update()
}
