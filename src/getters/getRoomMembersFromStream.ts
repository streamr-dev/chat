import StreamrClient, { PermissionAssignment, StreamPermission, UserPermissionQuery } from 'streamr-client'

export default async function getRoomMembersFromStream(
    streamrClient: StreamrClient,
    streamId: string
): Promise<string[]> {
    console.info('calling getRoomMembersFromStream')
    const members: string[] = []
    const membersStream = await streamrClient.getStream(
        streamId
    )
    const memberPermissions: PermissionAssignment[] =
        await membersStream.getPermissions()

    const isUserPermissionQuery = (
        assignment: any
    ): assignment is UserPermissionQuery => {
        return assignment.user
    }

    for (const assignment of memberPermissions) {
        if (
            isUserPermissionQuery(assignment) &&
            assignment.permissions.includes(
                StreamPermission.SUBSCRIBE
            )
        ) {
            members.push(assignment.user)
        }
    }
    console.log('found members', members)
    return members
}
