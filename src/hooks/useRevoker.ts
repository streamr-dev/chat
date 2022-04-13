import { useCallback } from 'react'
import { Stream } from 'streamr-client'
import { useSend } from '../components/pages/Chat/MessageTransmitter'
import { MessageType, MetadataType } from '../utils/types'

type Options = {
    revokee: string
    stream: Stream
}

type Revoker = ({ revokee, stream }: Options) => Promise<void>

export default function useRevoker(): Revoker {
    const send = useSend()
    return useCallback(
        async ({ revokee, stream }: Options) => {
            // fetch the specific permissions to revoke
            const streamPermissions = await stream.getPermissions()
            const [permissions] = streamPermissions
                .filter((item) => {
                    return (item as any).user === revokee
                })
                .map((item) => item.permissions)

            await stream.revokePermissions({
                user: revokee,
                permissions,
            })

            send(MetadataType.RevokeInvite, {
                messageType: MessageType.Metadata,
                streamId: stream.id,
                data: revokee,
            })
        },
        [send]
    )
}
