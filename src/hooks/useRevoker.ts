import { useCallback } from 'react'
import { Stream } from 'streamr-client'
import { useSend } from '../components/pages/Chat/MessageTransmitter'
import { MessageType } from '../utils/types'
import useEnsureMaticBalance from './useEnsureMaticBalance'

type Options = {
    revokee: string
    stream: Stream
}

type Revoker = ({ revokee, stream }: Options) => Promise<void>

export default function useRevoker(): Revoker {
    const ensureMaticBalance = useEnsureMaticBalance()

    return useCallback(async ({ revokee, stream }: Options) => {
        await ensureMaticBalance()
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
    }, [ensureMaticBalance])
}
