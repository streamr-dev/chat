import { useCallback } from 'react'
import { StreamPermission, STREAMR_STORAGE_NODE_GERMANY } from 'streamr-client'
import { ActionType, useDispatch, useStore } from '../components/Store'
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

            const normalizedRoomName = roomName.toLowerCase()

            if (!/^[a-zA-Z0-9-_]+$/.test(normalizedRoomName)) {
                throw new Error('Invalid room name')
            }

            const description: RoomMetadata = {
                name: normalizedRoomName,
                createdAt: Date.now(),
                privacy,
            }

            const stream = await metamaskStreamrClient.createStream({
                id: `/streamr-chat/room/${normalizedRoomName}`,
                description: JSON.stringify(description),
            })

            if (storageEnabled) {
                await stream.addToStorageNode(STREAMR_STORAGE_NODE_GERMANY)
                console.info(`Storage enabled on stream ${stream.id}`)
            }

            console.info(`Created stream ${stream.id}`)

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

            dispatch({
                type: ActionType.AddRoomIds,
                payload: [stream.id],
            })
        },
        [
            sessionAccount,
            metamaskStreamrClient,
            account,
            inviteSelf,
            dispatch,
            setPublicPermissions,
        ]
    )
}
