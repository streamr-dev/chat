import { put } from 'redux-saga/effects'
import { PermissionAssignment, StreamPermission } from 'streamr-client'
import { PermissionAction } from '..'
import handleError from '$/utils/handleError'
import isSameAddress from '$/utils/isSameAddress'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onFetchAllAction({
    payload: { roomId, address, streamrClient },
}: ReturnType<typeof PermissionAction.fetchAll>) {
    try {
        const assignments: PermissionAssignment[] = yield streamrClient.getPermissions(roomId)

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
    }
}

export default function* fetchAll() {
    yield takeEveryUnique(PermissionAction.fetchAll, onFetchAllAction)
}
