import { call } from 'redux-saga/effects'
import { EnhancedStream } from '../../../../types/common'
import getStreamSaga from '../../../sagas/getStreamSaga'
import { RoomId } from '../types'

export default function* renameRemoteRoomSaga(id: RoomId, name: string) {
    const stream: EnhancedStream = yield call(getStreamSaga, id)

    stream.description = name

    stream.extensions['thechat.eth'].updatedAt = Date.now()

    yield stream.update()
}
