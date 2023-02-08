import { call, put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import handleError from '$/utils/handleError'
import getStream from '$/utils/getStream'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { PermissionsAction } from '$/features/permissions'

export default function fetchPermission({
    roomId,
    address,
    permission,
    streamrClient,
}: ReturnType<typeof PermissionsAction.fetchPermission>['payload']) {
    return call(function* () {
        try {
            const stream: undefined | Stream = yield getStream(streamrClient, roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const value: boolean = yield stream.hasPermission({
                user: address,
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