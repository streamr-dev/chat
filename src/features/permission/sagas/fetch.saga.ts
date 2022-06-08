import { takeEvery, call, put, select } from 'redux-saga/effects'
import StreamrClient, { Stream } from 'streamr-client'
import handleError from '../../../utils/handleError'
import { PermissionAction } from '..'
import getStream from '../../../utils/getStream'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import { selectAbilityFetching, selectBulkFetching } from '../selectors'

function* onFetchAction({
    payload: { roomId, address, permission },
}: ReturnType<typeof PermissionAction.fetch>) {
    let dirty = false

    try {
        const fetching: boolean = yield select(selectAbilityFetching(roomId, address, permission))

        if (fetching) {
            return
        }

        const fetchingAll: boolean = yield select(selectBulkFetching(roomId, address))

        if (fetchingAll) {
            return
        }

        yield put(
            PermissionAction.setFetching({
                roomId,
                address,
                permission,
                state: true,
            })
        )

        dirty = true

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

            yield put(
                PermissionAction.setLocal({ roomId, address, permissions: { [permission]: value } })
            )
        } catch (e) {
            handleError(e)
        }
    } finally {
        if (dirty) {
            yield put(
                PermissionAction.setFetching({
                    roomId,
                    address,
                    permission,
                    state: false,
                })
            )
        }
    }
}

export default function* fetch() {
    yield takeEvery(PermissionAction.fetch, onFetchAction)
}
