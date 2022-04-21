import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Stream } from 'streamr-client'
import { useSend } from '../components/pages/Chat/MessageTransmitter'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
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

            const roomName = getRoomNameFromRoomId(stream.id)
            toast.info(`Deleting member ${revokee} from room ${roomName}`, {
                position: 'top-center',
            })

            await stream.revokePermissions({
                user: revokee,
                permissions,
            })

            toast.success(
                `Successfully revoked permissions [${permissions.join(
                    ', '
                )}] from user ${revokee}`,
                {
                    position: 'top-center',
                }
            )

            send(MetadataType.RevokeInvite, {
                messageType: MessageType.Metadata,
                streamId: stream.id,
                data: revokee,
            })
        },
        [send]
    )
}
