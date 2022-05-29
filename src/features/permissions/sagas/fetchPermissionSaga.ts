import { call, put, takeLatest } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import getStreamSaga from '../../../sagas/getStreamSaga'
import {
    fetchPermission,
    PermissionAction,
    setLocalPermission,
} from '../actions'

function* onFetchPermissionAction({
    payload: [roomId, address, permission],
}: ReturnType<typeof fetchPermission>) {
    try {
        const stream: Stream = yield call(getStreamSaga, roomId)

        const hasPermission: boolean = yield stream.hasPermission({
            user: address,
            permission,
            allowPublic: true,
        })

        yield put(
            setLocalPermission([roomId, address, permission, hasPermission])
        )
    } catch (e) {
        console.warn('Permission fetching failed.', e)
    }
}

export default function* fetchPermissionSaga() {
    yield takeLatest(PermissionAction.FetchPermission, onFetchPermissionAction)
}
