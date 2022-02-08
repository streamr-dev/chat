import { Stream, StreamPermission } from 'streamr-client'

export default async function getRoomMembersFromStream(
    stream: Stream
): Promise<string[]> {
    const members: string[] = []
    const memberPermissions = await stream.getPermissions()
    const addresses = Object.keys(memberPermissions)
    for (let i = 0; i < addresses.length; i++) {
        if (
            memberPermissions[addresses[i]].includes(StreamPermission.SUBSCRIBE)
        ) {
            members.push(addresses[i])
        }
    }
    return members
}
