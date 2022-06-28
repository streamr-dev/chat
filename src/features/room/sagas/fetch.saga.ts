import { takeEvery } from 'redux-saga/effects'
import { RoomAction } from '..'
import { EnhancedStream } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import db from '$/utils/db'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import { IRoom } from '../types'

function* onFetchAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof RoomAction.fetch>) {
    try {
        const stream: undefined | EnhancedStream = yield getStream(streamrClient, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const metadata = stream.extensions['thechat.eth']

        const owner = requester.toLowerCase()

        const existing: undefined | IRoom = yield db.rooms.where({ id: stream.id, owner }).first()

        if (existing) {
            return
        }

        return db.rooms.add({
            createdAt: metadata.createdAt,
            createdBy: metadata.createdBy,
            id: stream.id,
            name: stream.description || '',
            owner,
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    yield takeEvery(RoomAction.fetch, onFetchAction)
}
