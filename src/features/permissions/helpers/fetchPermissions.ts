import { call, put } from 'redux-saga/effects'
import StreamrClient, { PermissionAssignment, StreamPermission } from '@streamr/sdk'
import handleError from '$/utils/handleError'
import isSameAddress from '$/utils/isSameAddress'
import { PermissionsAction } from '$/features/permissions'
import getTransactionalClient from '$/utils/getTransactionalClient'

export default function fetchPermissions({
    roomId,
    address,
}: ReturnType<typeof PermissionsAction.fetchPermissions>['payload']) {
    return call(function* () {
        try {
            const streamrClient: StreamrClient = yield getTransactionalClient()

            const assignments: PermissionAssignment[] = yield streamrClient.getPermissions(roomId)

            const permissions: { [permission: string]: boolean } = {
                [StreamPermission.DELETE]: false,
                [StreamPermission.EDIT]: false,
                [StreamPermission.GRANT]: false,
                [StreamPermission.PUBLISH]: false,
                [StreamPermission.SUBSCRIBE]: false,
            }

            assignments.forEach((assignment) => {
                if ('public' in assignment || isSameAddress(assignment.userId, address)) {
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
