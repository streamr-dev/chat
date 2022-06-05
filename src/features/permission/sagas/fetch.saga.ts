import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient, { Stream } from 'streamr-client'
import handleError from '../../../utils/handleError'
import { PermissionAction } from '..'
import getStream from '../../../utils/getStream'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletClient from '../../../sagas/getWalletClient.saga'

function* onFetchAction({
    payload: { roomId, address, permission },
}: ReturnType<typeof PermissionAction.fetch>) {
    try {
        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | Stream = yield getStream(client, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const value: boolean = yield stream.hasPermission({
            user: address,
            permission,
            allowPublic: true,
        })

        yield put(PermissionAction.setLocal({ roomId, address, permission, value }))
    } catch (e) {
        handleError(e)
    }
}

export default function* fetch() {
    yield takeEvery(PermissionAction.fetch, onFetchAction)
}
