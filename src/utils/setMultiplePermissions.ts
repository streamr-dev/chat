import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { RoomId } from '$/features/room/types'
import { Address } from '$/types'
import waitForPermissions, { Validator } from '$/utils/waitForPermissions'
import preflight from '$/utils/preflight'
import { call, put } from 'redux-saga/effects'
import StreamrClient, { StreamPermission, UserPermissionAssignment } from '@streamr/sdk'
import getTransactionalClient from '$/utils/getTransactionalClient'

interface Options {
    requester: Address
    validate?: boolean | Validator
}

interface AssignmentsMap {
    [user: Address]: StreamPermission[]
}

// @FIXME: Rename to `setMultipleUserPermissions` for clarity.
export default function setMultiplePermissions(
    roomId: RoomId,
    assignments: UserPermissionAssignment[],
    { requester, validate = true }: Options
) {
    return call(function* () {
        yield preflight(requester)

        const streamrClient: StreamrClient = yield getTransactionalClient()

        yield streamrClient.setPermissions({
            streamId: roomId,
            assignments,
        })

        for (let i = 0; i < assignments.length; i++) {
            yield put(PermissionsAction.invalidateAll({ roomId, address: assignments[i].userId }))
        }

        if (validate === true) {
            const assignmentsMap: AssignmentsMap = {}

            const emptyAssignments: UserPermissionAssignment[] = []

            assignments.forEach((a) => {
                // Array#sort() mutates the array thus we use a copy.
                assignmentsMap[a.userId.toLowerCase()] = [...a.permissions].sort()

                if (!a.permissions.length) {
                    emptyAssignments.push(a)
                }
            })

            // Default validator checks if new assignments match the remote ones.
            yield waitForPermissions(streamrClient, roomId, (currentAssignments) => {
                // We modify the map later in this function thus we have to operate on a copy.
                const copy = {
                    ...assignmentsMap,
                }

                // Removed users are not gonna appear in `currentAssignments`. To simplicity's sake
                // we append all "remove" assignments so that the algorithm stands.
                const current = [...currentAssignments, ...emptyAssignments]

                for (let i = 0; i < current.length; i++) {
                    const a = current[i]

                    if (!('userId' in a)) {
                        continue
                    }

                    const user = a.userId.toLowerCase()

                    if (copy[user]) {
                        const left = JSON.stringify([...a.permissions].sort())

                        const right = JSON.stringify(copy[user])

                        if (left === right) {
                            // If current permissions match expected permissions we remove user's
                            // record from `copy`.
                            delete copy[user]
                        }
                    }

                    // Empty `copy` = all pairs match (local = remote).
                    if (!Object.keys(copy).length) {
                        return true
                    }
                }

                return false
            })
        }

        if (typeof validate === 'function') {
            yield waitForPermissions(streamrClient, roomId, validate)
        }

        yield put(
            PermissionsAction.detectRoomMembers({
                roomId,
                fingerprint: Flag.isDetectingMembers(roomId),
            })
        )
    })
}
