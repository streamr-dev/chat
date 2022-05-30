import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import fetchRoomPermission from '../../../utils/fetchRoomPermission'
import handleError from '../../../utils/handleError'
import { fetchPermission, PermissionAction, setLocalPermission } from '../actions'

function* onFetchPermissionAction({
    payload: { roomId, address, permission },
}: ReturnType<typeof fetchPermission>) {
    try {
        const client: StreamrClient = yield call(getWalletClientSaga)

        const hasPermission: boolean = yield fetchRoomPermission({
            roomId,
            address,
            permission,
            client,
        })

        yield put(setLocalPermission({ roomId, address, permission, value: hasPermission }))
    } catch (e) {
        handleError(e)
    }
}

export default function* fetchPermissionSaga() {
    yield takeEvery(PermissionAction.FetchPermission, onFetchPermissionAction)
}
