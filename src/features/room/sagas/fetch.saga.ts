import { takeEvery } from 'redux-saga/effects'
import { RoomAction } from '..'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { IRoom } from '../types'
import { Stream } from 'streamr-client'
import getRoomMetadata from '$/utils/getRoomMetadata'

function* onFetchAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof RoomAction.fetch>) {
    try {
        const stream: null | Stream = yield streamrClient.getStream(roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const { createdAt, createdBy, name = '' } = getRoomMetadata(stream)

        const owner = requester.toLowerCase()

        const existing: undefined | IRoom = yield db.rooms.where({ id: stream.id, owner }).first()

        if (existing) {
            return
        }

        return db.rooms.add({
            createdAt,
            createdBy,
            id: stream.id,
            name,
            owner,
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    yield takeEvery(RoomAction.fetch, onFetchAction)
}
