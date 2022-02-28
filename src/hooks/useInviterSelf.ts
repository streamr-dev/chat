import { useCallback } from 'react'
import { Stream, StreamPermission } from 'streamr-client'
import { useStore } from '../components/Store'

type Options = {
    streams: Stream[]
}

type Inviter = ({ streams }: Options) => Promise<void>

export default function useInviterSelf(): Inviter {
    const { metamaskStreamrClient, session: { wallet } } = useStore()
    return useCallback(
        async ({ streams }: Options) => {
            if (!metamaskStreamrClient || !wallet) {
                return
            }

            console.info(
                'calling inviteSelf for streams',
                streams.map((s) => s.id),
                `on account ${wallet.address}`
            )

            const tasks = streams.map((stream) => {
                return {
                    streamId: stream.id,
                    assignments: [
                        {
                            user: wallet.address,
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
