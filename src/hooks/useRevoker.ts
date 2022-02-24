import { useCallback } from 'react'
import { Stream } from 'streamr-client'

type Options = {
    revokee: string
    stream: Stream
}

type Revoker = ({ revokee, stream }: Options) => Promise<void>

export default function useRevoker(): Revoker {
    return useCallback(
        async ({ revokee, stream }: Options) =>
            await stream.revokeAllUserPermissions(revokee),
        []
    )
}
