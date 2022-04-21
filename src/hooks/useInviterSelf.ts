import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { StreamPermission } from 'streamr-client'
import { useStore } from '../components/Store'

type Options = {
    streamIds: string[]
    includePublicPermissions?: boolean
}

type Inviter = ({
    streamIds,
    includePublicPermissions,
}: Options) => Promise<void>

export default function useInviterSelf(): Inviter {
    const {
        metamaskStreamrClient,
        session: { wallet },
    } = useStore()

    return useCallback(
        async ({ streamIds, includePublicPermissions }: Options) => {
            if (!metamaskStreamrClient || !wallet) {
                return
            }

            console.info(
                'calling inviteSelf for streams',
                streamIds,
                `on account ${wallet.address}`,
                includePublicPermissions
                    ? 'with public permissions'
                    : 'without public permissions'
            )

            toast.info(`Authorizing your delegated wallet ${wallet.address}`, {
                position: 'top-center',
            })

            const tasks = streamIds.map((streamId) => {
                const assignments: any[] = [
                    {
                        user: wallet.address,
                        permissions: [
                            StreamPermission.SUBSCRIBE,
                            StreamPermission.PUBLISH,
                        ],
                    },
                ]

                if (includePublicPermissions) {
                    assignments.push({
                        public: true as true,
                        permissions: [StreamPermission.SUBSCRIBE],
                    })
                }
                return {
                    streamId: streamId,
                    assignments,
                }
            })

            await metamaskStreamrClient.setPermissions(...tasks)

            toast.success(
                `Successfully authorized your delegated wallet ${wallet.address}`,
                {
                    position: 'top-center',
                }
            )
        },
        [metamaskStreamrClient, wallet]
    )
}
