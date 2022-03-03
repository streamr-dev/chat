import { useCallback } from 'react'
import { StreamPermission } from 'streamr-client'
import { useStore } from '../components/Store'

type Options = {
    streamIds: string[]
}

type Inviter = ({ streamIds }: Options) => Promise<void>

export default function useInviterSelf(): Inviter {
    const {
        metamaskStreamrClient,
        session: { wallet },
    } = useStore()
    return useCallback(
        async ({ streamIds }: Options) => {
            if (!metamaskStreamrClient || !wallet) {
                return
            }

            console.info(
                'calling inviteSelf for streams',
                streamIds,
                `on account ${wallet.address}`
            )

            const tasks = streamIds.map((streamId) => {
                return {
                    streamId: streamId,
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
        [metamaskStreamrClient, wallet]
    )
}
