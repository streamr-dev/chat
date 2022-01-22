import { useCallback } from 'react'
import { Stream, StreamOperation, StreamPermision } from 'streamr-client'

type Options = {
    invitee: string
    stream: Stream
}

type Inviter = ({ invitee, stream }: Options) => Promise<StreamPermision[]>

export default function useInviter(): Inviter {
    return useCallback(
        async ({ invitee, stream }: Options) =>
            await stream.grantPermissions(
                [
                    StreamOperation.STREAM_DELETE,
                    StreamOperation.STREAM_EDIT,
                    StreamOperation.STREAM_GET,
                    StreamOperation.STREAM_PUBLISH,
                    StreamOperation.STREAM_SHARE,
                    StreamOperation.STREAM_SUBSCRIBE,
                ],
                invitee
            ),
        []
    )
}
