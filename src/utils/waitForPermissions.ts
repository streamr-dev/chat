import { RoomId } from '$/features/room/types'
import { retry } from 'redux-saga/effects'
import StreamrClient, { PermissionAssignment } from 'streamr-client'

export type Validator = (assignments: PermissionAssignment[]) => boolean

export default function waitForPermissions(
    streamrClient: StreamrClient,
    roomId: RoomId,
    validator: Validator
) {
    return retry(30, 1000, function* () {
        const assignments: PermissionAssignment[] = yield streamrClient.getPermissions(roomId)

        if (!validator(assignments)) {
            throw new Error('Validation failed')
        }
    })
}
