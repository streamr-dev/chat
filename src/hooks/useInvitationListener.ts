import { useCallback } from 'react'
import { useStore } from '../components/Store'
import { BigNumber } from 'ethers'
import getStreamRegistryAt from '../getters/getStreamRegistryAt'
import { toast } from 'react-toastify'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
import { ROOM_PREFIX } from './useExistingRooms'
import useInviterSelf from './useInviterSelf'

const StreamRegistryAddress = '0x0D483E10612F327FC11965Fc82E90dC19b141641'

type ListenerParams = () => Promise<void>

export default function useInvitationListener(): ListenerParams {
    const { account, ethereumProvider } = useStore()
    const inviterSelf = useInviterSelf()

    return useCallback(async () => {
        if (!ethereumProvider || !account) {
            return
        }

        const streamRegistry = getStreamRegistryAt(StreamRegistryAddress)

        const filter = streamRegistry.filters.PermissionUpdated(
            null,
            null,
            null,
            null,
            null,
            null,
            null
        )

        streamRegistry.on(
            filter,
            (
                streamId: string,
                userAddress: string,
                canEdit: boolean,
                canDelete: boolean,
                publishExpirationTimestampSeconds: BigNumber,
                subscribeExpirationTimestampSeconds: BigNumber,
                canGrant: boolean
            ) => {
                const user = userAddress.toLowerCase()

                if (
                    user !== account ||
                    !canGrant ||
                    !streamId.includes(ROOM_PREFIX)
                ) {
                    return
                }

                const roomName = getRoomNameFromRoomId(streamId)
                console.info(`You have been invited to join room ${roomName}`)
                toast.info(
                    `You have been invited to join room ${roomName}. Click here to accept the invitation`,
                    {
                        position: 'top-center' as 'top-center',
                        autoClose: false as false,
                        progress: undefined,
                        onClick: async () => {
                            await inviterSelf({
                                streamIds: [streamId],
                            })
                            toast.dismiss()
                        },
                    }
                )
            }
        )
    }, [account, ethereumProvider, inviterSelf])
}
