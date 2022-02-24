import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
import { useStore } from '../components/Store'

type Options = {
    invitee: string
    streams: Stream[]
}

type Inviter = ({ invitee, streams }: Options) => Promise<void>

export default function useInviterSelf(): Inviter {
    const { metamaskStreamrClient } = useStore()
    return useCallback(
        async ({ invitee, streams }: Options) => {
            if (!metamaskStreamrClient) {
                return
            }

            console.info('calling inviteSelf for streams', streams.map(s => s.id))

            const tasks = streams.map((stream) => {
                return {
                    streamId: stream.id,
                    assignments: [
                        {
                            user: invitee,
                            permissions: [
                                StreamPermission.SUBSCRIBE,
                                StreamPermission.PUBLISH,
                            ],
                        },
                    ],
                }
            })

            await metamaskStreamrClient.setPermissions(...tasks)
        },
        [metamaskStreamrClient]
    )
}
