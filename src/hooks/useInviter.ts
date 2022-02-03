import { useCallback } from 'react'
import { Stream } from 'streamr-client'

type Options = {
    invitees: string[]
    stream: Stream
}

type Inviter = ({ invitees, stream }: Options) => Promise<void>

export default function useInviter(): Inviter {
    return useCallback(async ({ invitees, stream }: Options) => {
        const permissions = {
            canEdit: false,
            canDelete: false,
            canPublish: true,
            canSubscribe: true,
            canGrant: true,
        }

        await stream.setPermissions(
            invitees,
            invitees.map(() => permissions)
        )
    }, [])
}
