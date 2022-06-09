import { call, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { RoomAction } from '..'
import { EnhancedStream } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getWalletClient from '$/sagas/getWalletClient.saga'
import db from '$/utils/db'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import { IRoom } from '../types'

function* onFetchAction({ payload: { roomId, address } }: ReturnType<typeof RoomAction.fetch>) {
    try {
        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | EnhancedStream = yield getStream(client, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const metadata = stream.extensions['thechat.eth']

        const owner = address.toLowerCase()

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
            privacy: metadata.privacy,
            useStorage: metadata.useStorage,
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    yield takeEvery(RoomAction.fetch, onFetchAction)
}
