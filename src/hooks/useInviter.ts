import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
import { useSend } from '../components/pages/Chat/MessageTransmitter'
import { MessageType, MetadataType } from '../utils/types'

type Options = {
    invitees: string[]
    stream: Stream
}

type Inviter = ({ invitees, stream }: Options) => Promise<void>

export default function useInviter(): Inviter {
    const send = useSend()
    return useCallback(
        async ({ invitees, stream }: Options) => {
            const tasks: { user: string; permissions: StreamPermission[] }[] =
                []
            for (let i = 0; i < invitees.length; i++) {
                tasks.push({
                    user: invitees[i],
                    permissions: [StreamPermission.GRANT],
                })
            }
            await stream.grantPermissions(...tasks)

            tasks.forEach(({ user }) => {
                send(MetadataType.SendInvite, {
                    messageType: MessageType.Metadata,
                    streamId: stream.id,
                    data: user,
                })
            })
        },
        [send]
    )
}
