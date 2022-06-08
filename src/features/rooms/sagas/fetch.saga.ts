import { call, put, takeLatest } from 'redux-saga/effects'
import StreamrClient, { StreamPermission } from 'streamr-client'
import { RoomsAction } from '..'
import { Address, Prefix } from '../../../../types/common'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import handleError from '../../../utils/handleError'
import { RoomAction } from '../../room'
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

function* onFetchAction() {
    try {
        const client: StreamrClient = yield call(getWalletClient)

        const account: Address = yield call(getWalletAccount)

        const ids: RoomId[] = yield getRoomIds(client, account)

        for (let i = 0; i < ids.length; i++) {
            yield put(
                RoomAction.fetch({
                    roomId: ids[i],
                    address: account,
                })
            )
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    yield takeLatest(RoomsAction.fetch, onFetchAction)
}
