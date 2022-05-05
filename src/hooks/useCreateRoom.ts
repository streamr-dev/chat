import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { StreamPermission, STREAMR_STORAGE_NODE_GERMANY } from 'streamr-client'
import { ActionType, useDispatch, useStore } from '../components/Store'
import useEnsureMaticBalance from './useEnsureMaticBalance'
import { RoomMetadata, RoomPrivacy } from '../utils/types'
import useInviterSelf from './useInviterSelf'
import useSetPublicPermissions from './useSetPublicPermissions'

type Options = {
    roomName: string
    privacy: RoomPrivacy
    storageEnabled?: boolean
}
export default function useCreateRoom(): ({
    roomName,
    privacy,
    storageEnabled,
}: Options) => Promise<void> {
    const {
        session: { wallet },
        account,
        metamaskStreamrClient,
    } = useStore()

    const sessionAccount = wallet?.address

    const inviteSelf = useInviterSelf()
    const setPublicPermissions = useSetPublicPermissions()

    const dispatch = useDispatch()

    const ensureMaticBalance = useEnsureMaticBalance()

    return useCallback(
        async ({ roomName, privacy, storageEnabled }) => {
            if (!sessionAccount) {
                throw new Error('Missing session account')
            }

            if (!account) {
                throw new Error('Missing account')
            }

            if (!metamaskStreamrClient) {
                throw new Error('Missing metamask streamr client')
            }

            await ensureMaticBalance()

            const normalizedRoomName = roomName.toLowerCase()

            if (!/^[a-zA-Z0-9-_]+$/.test(normalizedRoomName)) {
                throw new Error('Invalid room name')
            }

            const description: RoomMetadata = {
                name: normalizedRoomName,
                createdAt: Date.now(),
                privacy,
            }

            toast.info(`Creating room ${normalizedRoomName}`, {
                position: 'top-center',
            })

            const stream = await metamaskStreamrClient.createStream({
                id: `/streamr-chat/room/${normalizedRoomName}`,
                description: JSON.stringify(description),
            })

            console.info(`Created stream ${stream.id}`)
            toast.success(`Created room ${normalizedRoomName}`, {
                position: 'top-center',
            })

            if (storageEnabled) {
                toast.info(`Enabling storage for room ${normalizedRoomName}`, {
                    position: 'top-center',
                })
                await stream.addToStorageNode(STREAMR_STORAGE_NODE_GERMANY)
                console.info(`Storage enabled on stream ${stream.id}`)
                toast.success(
                    `Storage enabled for room ${normalizedRoomName}`,
                    {
                        position: 'top-center',
                    }
                )
            }

            toast.info(`Setting permissions for room ${normalizedRoomName}`, {
                position: 'top-center',
            })

            switch (privacy) {
                case RoomPrivacy.Private:
                    await inviteSelf({
                        streamIds: [stream.id],
                    })
                    break

                case RoomPrivacy.ViewOnly:
                    await inviteSelf({
                        streamIds: [stream.id],
                        includePublicPermissions: true,
                    })
                    break
                case RoomPrivacy.Public:
                    await setPublicPermissions({
                        permissions: [
                            StreamPermission.PUBLISH,
                            StreamPermission.SUBSCRIBE,
                        ],
                        stream,
                    })
                    break
            }

            console.info(
                `Assigned ${privacy} permissions to stream ${stream.id}`
            )

            toast.success(`Permissions set for room ${normalizedRoomName}`, {
                position: 'top-center',
            })

            dispatch({
                type: ActionType.AddRoomIds,
                payload: [stream.id],
            })
        },
        [
            account,
            dispatch,
            ensureMaticBalance,
            inviteSelf,
            metamaskStreamrClient,
            sessionAccount,
            setPublicPermissions,
        ]
    )
}
