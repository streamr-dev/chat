import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'

type Options = {
    metamaskStream: Stream,
    sessionAddress: string
}

type Inviter = ({ metamaskStream, sessionAddress }: Options) => Promise<void>

export default function useAcceptInvite(): Inviter {
    return useCallback(async ({ metamaskStream, sessionAddress }: Options) => {
        await metamaskStream.grantPermissions({
            user: sessionAddress,
            permissions: [
                StreamPermission.SUBSCRIBE,
                StreamPermission.PUBLISH,
            ]
        })
    }, [])
}
