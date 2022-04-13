import {
    PermissionAssignment,
    Stream,
    StreamPermission,
    UserPermissionQuery,
} from 'streamr-client'
import getRoomMetadata from './getRoomMetadata'

const isUserPermissionQuery = (
    assignment: any
): assignment is UserPermissionQuery => {
    return assignment.user
}

export default async function getRoomMembersFromStream(
    stream: Stream
): Promise<string[]> {
    const members: string[] = []
    const memberPermissions: PermissionAssignment[] =
        await stream.getPermissions()

    const metadata = getRoomMetadata(stream.description!)

    // on public streams return an empty array

    if (metadata.privacy === 'public') {
        return members
    }

    for (const assignment of memberPermissions) {
        if (
            isUserPermissionQuery(assignment) &&
            // on read-only streams return those with PUBLISH permission

            ((metadata.privacy === 'viewonly' &&
                assignment.permissions.includes(StreamPermission.PUBLISH)) ||
                // on private streams return those with GRANT permission

                (metadata.privacy === 'private' &&
                    assignment.permissions.includes(StreamPermission.GRANT)) ||
                assignment.permissions.includes(StreamPermission.SUBSCRIBE))
        ) {
            members.push(assignment.user)
        }
    }
    return members
}
