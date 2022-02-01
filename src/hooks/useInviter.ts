import { useCallback } from 'react'
import { Stream } from 'streamr-client'

type Options = {
    invitee: string
    stream: Stream
}

type Inviter = ({ invitee, stream }: Options) => Promise<void>

export default function useInviter(): Inviter {
    return useCallback(
        async ({ invitee, stream }: Options) =>
            await stream.setPermissionsForUser(
                invitee,
                false, // edit
                false, // delete
                true, // publish
                true, //subscribe
                true // share
            ),
        []
    )
}
