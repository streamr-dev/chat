import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
import { useSend } from '../components/pages/Chat/MessageTransmitter'
import { MessageType } from '../utils/types'
import useEnsureMaticBalance from './useEnsureMaticBalance'

type Options = {
    invitees: string[]
    stream: Stream
}

type Inviter = ({ invitees, stream }: Options) => Promise<void>

export default function useInviter(): Inviter {
    const ensureMaticBalance = useEnsureMaticBalance()

    return useCallback(async ({ invitees, stream }: Options) => {
        await ensureMaticBalance()

        const tasks: { user: string; permissions: StreamPermission[] }[] = []
        for (let i = 0; i < invitees.length; i++) {
            tasks.push({
                user: invitees[i],
                permissions: [StreamPermission.GRANT],
            })
        }
        await stream.grantPermissions(...tasks)

        console.info(`Invited ${invitees.join(', ')} to stream ${stream.id}`)
    }, [ensureMaticBalance])
}
