import { useCallback } from 'react'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'

type Options = {
    invitee: string
    streams: Stream[]
    client: StreamrClient
}

type Inviter = ({ invitee, streams, client }: Options) => Promise<void>

export default function useInviterSelf(): Inviter {
    return useCallback(async ({ invitee, streams, client }: Options) => {
        /*
        const tasks = []
        for (let i = 0; i < invitees.length; i++) {
            tasks.push({
                user: invitees[i],
                permissions: [
                    StreamPermission.SUBSCRIBE,
                    StreamPermission.PUBLISH,
                ],
            })
        }*/

        const tasks = streams.map(stream => {
            return {
                streamId: stream.id,
                assignments: {
                    user: invitee,
                    permissions: [
                        StreamPermission.SUBSCRIBE,
                        StreamPermission.PUBLISH,
                    ],
                }
            }
        })

        await client.setPermissions(tasks)
    }, [])
}
