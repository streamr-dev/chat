import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Stream, StreamPermission } from 'streamr-client'
import { useStore } from '../components/Store'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'

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
            const roomName = getRoomNameFromRoomId(stream.id)
            toast.info(`Setting public permissions for room ${roomName}`, {
                position: 'top-center',
            })

            await metamaskStreamrClient.setPermissions({
                streamId: stream.id,
                assignments: [
                    {
                        public: true,
                        permissions,
                    },
                ],
            })

            toast.success(
                `Successfully set public permissions for room ${roomName}`,
                {
                    position: 'top-center',
                }
            )
        },
        [metamaskStreamrClient]
    )
}
