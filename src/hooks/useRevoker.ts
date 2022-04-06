import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
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
            await stream.revokePermissions({
                user: revokee,
                permissions: [
                    StreamPermission.SUBSCRIBE,
                    StreamPermission.PUBLISH,
                    StreamPermission.GRANT,
                ],
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
