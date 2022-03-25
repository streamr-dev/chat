import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'

type Options = {
    stream: Stream
    permissions: StreamPermission[]
}

export default function useSetPublicPermissions(): ({
    permissions,
    stream,
}: Options) => Promise<void> {
    return useCallback(async ({ permissions, stream }: Options) => {
        await stream.grantPermissions({
            public: true,
            permissions,
        })
    }, [])
}
