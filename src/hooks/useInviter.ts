import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Stream, StreamPermission } from 'streamr-client'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
import useEnsureMaticBalance from './useEnsureMaticBalance'

type Options = {
    invitees: string[]
    stream: Stream
}

type Inviter = ({ invitees, stream }: Options) => Promise<void>

export default function useInviter(): Inviter {
    const ensureMaticBalance = useEnsureMaticBalance()

    return useCallback(
        async ({ invitees, stream }: Options) => {
            await ensureMaticBalance()

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
        [ensureMaticBalance]
    )
}
