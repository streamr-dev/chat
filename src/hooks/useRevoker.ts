import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { Stream } from 'streamr-client'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
import useEnsureMaticBalance from './useEnsureMaticBalance'

type Options = {
    revokee: string
    stream: Stream
}

type Revoker = ({ revokee, stream }: Options) => Promise<void>

export default function useRevoker(): Revoker {
    const ensureMaticBalance = useEnsureMaticBalance()

    return useCallback(
        async ({ revokee, stream }: Options) => {
            await ensureMaticBalance()
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
        },
        [ensureMaticBalance]
    )
}
