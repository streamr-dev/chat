import { call, put } from 'redux-saga/effects'
import { Stream } from '@streamr/sdk'
import handleError from '$/utils/handleError'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'
import fetchStream from '$/utils/fetchStream'

export default function fetchPermission({
    roomId,
    address,
    permission,
}: ReturnType<typeof PermissionsAction.fetchPermission>['payload']) {
    return call(function* () {
        try {
            const stream: Stream | null = yield fetchStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const value: boolean = yield stream.hasPermission({
                userId: address,
                permission,
                allowPublic: true,
            })

            yield put(
                PermissionsAction.setPermissions({
                    roomId,
                    address,
                    permissions: { [permission]: value },
                })
            )
        } catch (e) {
            handleError(e)
        }
    })
}
