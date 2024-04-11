import { Address } from '$/types'
import isSameAddress from '$/utils/isSameAddress'
import { PermissionAssignment, Stream, StreamPermission } from '@streamr/sdk'

export type UserPermissions = [StreamPermission[], boolean]

export default async function getUserPermissions(
    user: Address,
    stream: Stream
): Promise<UserPermissions> {
    const assignments: PermissionAssignment[] = await stream.getPermissions()

    let isPublic = false

    let permissions: StreamPermission[] = []

    for (let i = 0; i < assignments.length; i++) {
        const assignment = assignments[i]

        if ('public' in assignment) {
            if (assignment.permissions.includes(StreamPermission.SUBSCRIBE)) {
                isPublic = true
            }

            continue
        }

        if (isSameAddress(assignment.user, user)) {
            permissions = assignment.permissions
        }
    }

    return [permissions, isPublic]
}
