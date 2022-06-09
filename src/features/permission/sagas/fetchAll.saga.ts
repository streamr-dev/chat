import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient, { PermissionAssignment, StreamPermission } from 'streamr-client'
import { PermissionAction } from '..'
import getWalletClientSaga from '$/sagas/getWalletClient.saga'
import handleError from '$/utils/handleError'
import isSameAddress from '$/utils/isSameAddress'
import { selectBulkFetching } from '../selectors'

function* onFetchAllAction({
    payload: { roomId, address },
}: ReturnType<typeof PermissionAction.fetchAll>) {
    let dirty = false

    try {
        const fetchingAll: boolean = yield select(selectBulkFetching(roomId, address))

        if (fetchingAll) {
            return
        }

        yield put(
            PermissionAction.setFetchingAll({
                roomId,
                address,
                state: true,
            })
        )

        dirty = true

        const client: StreamrClient = yield call(getWalletClientSaga)

        const assignments: PermissionAssignment[] = yield client.getPermissions(roomId)

        const permissions: { [permission: string]: boolean } = {
            [StreamPermission.DELETE]: false,
            [StreamPermission.EDIT]: false,
            [StreamPermission.GRANT]: false,
            [StreamPermission.PUBLISH]: false,
            [StreamPermission.SUBSCRIBE]: false,
        }

        assignments.forEach((assignment) => {
            if ('user' in assignment && isSameAddress(assignment.user, address)) {
                assignment.permissions.forEach((permission) => {
                    permissions[permission] = true
                })
            }
        })

        yield put(
            PermissionAction.setLocal({
                roomId,
                address,
                permissions,
            })
        )
    } catch (e) {
        handleError(e)
    } finally {
        if (dirty) {
            yield put(
                PermissionAction.setFetchingAll({
                    roomId,
                    address,
                    state: false,
                })
            )
        }
    }
}

export default function* fetchAll() {
    yield takeEvery(PermissionAction.fetchAll, onFetchAllAction)
}
