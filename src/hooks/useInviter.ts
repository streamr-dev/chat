import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Stream, StreamPermission } from 'streamr-client'
import { useSend } from '../components/pages/Chat/MessageTransmitter'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
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

            const roomName = getRoomNameFromRoomId(stream.id)
            toast.info(
                `Inviting users [${invitees.join(', ')}] to room ${roomName}`,
                {
                    position: 'top-center',
                }
            )

            await stream.grantPermissions(...tasks)

            tasks.forEach(({ user }) => {
                send(MetadataType.SendInvite, {
                    messageType: MessageType.Metadata,
                    streamId: stream.id,
                    data: user,
                })
            })

            console.info(
                `Invited ${invitees.join(', ')} to stream ${stream.id}`
            )

            toast.success(
                `Successfully invited users [${invitees.join(
                    ', '
                )}] to room ${roomName}`,
                {
                    position: 'top-center',
                }
            )
        },
        [send]
    )
}
