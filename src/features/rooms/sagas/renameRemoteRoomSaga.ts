import { call } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import getWalletClientSaga from '../../../sagas/getWalletClientSaga'
import { RoomId } from '../types'

export default function* renameRemoteRoomSaga(id: RoomId, name: string) {
    const client: StreamrClient = yield call(getWalletClientSaga)

    yield client.updateStream({
        id,
        description: name,
    })
}
