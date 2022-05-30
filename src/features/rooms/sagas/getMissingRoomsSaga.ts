import { call, takeLatest } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'
import { UnsafeStream, Prefix, Address } from '../../../../types/common'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import db from '../../../utils/db'
import handleError from '../../../utils/handleError'
import sanitizeStream from '../../../utils/sanitizeStream'
import { RoomAction } from '../actions'
import { RoomId } from '../types'

async function getRoomIds(client: StreamrClient, account: string) {
    const ids: RoomId[] = []

    const search = client.searchStreams(Prefix.Room, {
        user: account,
        anyOf: [StreamPermission.GRANT, StreamPermission.SUBSCRIBE],
        allowPublic: false,
    })

    for await (const stream of search) {
        ids.push(stream.id)
    }

    return ids
}

async function addLocalRoomFromStream(stream: UnsafeStream, owner: string) {
    const metadata = sanitizeStream(stream).extensions['thechat.eth']

    const alreadyExists = await db.rooms.where({ id: stream.id, owner }).first()

    if (alreadyExists) {
        return undefined
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
}

function* onGetMissingRoomsAction() {
    try {
        const client: StreamrClient = yield call(getWalletClientSaga)

        const account: Address = yield call(getWalletAccountSaga)

        const ids: RoomId[] = yield getRoomIds(client, account)

        for (let i = 0; i < ids.length; i++) {
            const stream: undefined | Stream = yield client.getStream(ids[i])

            if (stream) {
                yield addLocalRoomFromStream(stream, account.toLowerCase())
            }
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* getMissingRoomsSaga() {
    yield takeLatest(RoomAction.GetMissingRooms, onGetMissingRoomsAction)
}
