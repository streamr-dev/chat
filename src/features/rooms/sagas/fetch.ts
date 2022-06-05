import { call, takeLatest } from 'redux-saga/effects'
import StreamrClient, { StreamPermission } from 'streamr-client'
import { RoomsAction } from '..'
import { Address, EnhancedStream, Prefix } from '../../../../types/common'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import db from '../../../utils/db'
import getStream from '../../../utils/getStream'
import handleError from '../../../utils/handleError'
import { RoomId } from '../../room/types'

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

async function addLocalRoomFromStream(stream: EnhancedStream, owner: string) {
    const metadata = stream.extensions['thechat.eth']

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

function* onFetchAction() {
    try {
        const client: StreamrClient = yield call(getWalletClient)

        const account: Address = yield call(getWalletAccount)

        const ids: RoomId[] = yield getRoomIds(client, account)

        for (let i = 0; i < ids.length; i++) {
            try {
                const stream: undefined | EnhancedStream = yield getStream(client, ids[i])

                if (stream) {
                    yield addLocalRoomFromStream(stream, account.toLowerCase())
                }
            } catch (e) {
                handleError(e)
            }
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    yield takeLatest(RoomsAction.fetch, onFetchAction)
}
