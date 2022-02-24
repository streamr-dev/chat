import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'

type Options = {
    invitees: string[]
    stream: Stream
}

type Inviter = ({ invitees, stream }: Options) => Promise<void>

export default function useInviter(): Inviter {
    return useCallback(async ({ invitees, stream }: Options) => {
        const tasks = []
        for (let i = 0; i < invitees.length; i++) {
            tasks.push({
                user: invitees[i],
                permissions: [
                    StreamPermission.GRANT
                ],
            })
        }
        await stream.grantPermissions(...tasks)
    }, [])
}
