import { call, put } from 'redux-saga/effects'
import { PermissionAssignment, Stream } from '@streamr/sdk'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import { EnsAction } from '$/features/ens'
import getAccountType, { AccountType } from '$/utils/getAccountType'
import { Flag } from '$/features/flag/types'
import { DelegationAction } from '$/features/delegation'
import { PermissionsAction } from '$/features/permissions'
import { IMember } from '$/features/permissions/types'
import fetchStream from '$/utils/fetchStream'

export default function detectRoomMembers({
    roomId,
}: ReturnType<typeof PermissionsAction.detectRoomMembers>['payload']) {
    return call(function* () {
        try {
            const members: IMember[] = []

            const stream: Stream | null = yield fetchStream(roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const assignments: PermissionAssignment[] = yield stream.getPermissions()

            for (const assignment of assignments) {
                if (!('userId' in assignment) || !assignment.userId) {
                    // Skip `PublicPermissionAssignment` items.
                    continue
                }

                if (!assignment.permissions.length) {
                    continue
                }

                const accountType = yield* getAccountType(assignment.userId)

                if (accountType === AccountType.Delegated) {
                    yield put(
                        DelegationAction.lookup({
                            delegated: assignment.userId,
                            fingerprint: Flag.isLookingUpDelegation(assignment.userId),
                        })
                    )

                    // Exclude delegated accounts from the members list. When we delete a main/unset
                    // accounts from a room we're gonna fetch the list of delegatees anyway (@TODO).
                    continue
                }

                members.push({
                    address: assignment.userId,
                    permissions: assignment.permissions,
                    accountType,
                })
            }

            yield put(PermissionsAction.setRoomMembers({ roomId, members }))

            yield put(EnsAction.fetchNames(members.map(({ address }) => address)))
        } catch (e) {
            handleError(e)
        }
    })
}
