import { call, put } from 'redux-saga/effects'
import { PermissionAssignment, StreamPermission } from 'streamr-client'
import handleError from '$/utils/handleError'
import isSameAddress from '$/utils/isSameAddress'
import { PermissionsAction } from '$/features/permissions'

export default function fetchPermissions({
    roomId,
    address,
    streamrClient,
}: ReturnType<typeof PermissionsAction.fetchPermissions>['payload']) {
    return call(function* () {
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
                PermissionsAction.setPermissions({
                    roomId,
                    address,
                    permissions,
                })
            )
        } catch (e) {
            handleError(e)
        }
    })
}
