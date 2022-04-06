import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
import { useStore } from '../components/Store'

type Options = {
    stream: Stream
    permissions: StreamPermission[]
}

export default function useSetPublicPermissions(): ({
    permissions,
    stream,
}: Options) => Promise<void> {
    const { metamaskStreamrClient } = useStore()
    return useCallback(
        async ({ permissions, stream }: Options) => {
            if (!metamaskStreamrClient) {
                throw new Error('No metamask streamr client found')
            }

            await metamaskStreamrClient.setPermissions({
                streamId: stream.id,
                assignments: [
                    {
                        public: true,
                        permissions,
                    },
                ],
            })
        },
        [metamaskStreamrClient]
    )
}
