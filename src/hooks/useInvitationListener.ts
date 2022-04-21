import { useCallback } from 'react'
import { useStore } from '../components/Store'
import { BigNumber } from 'ethers'
import getStreamRegistryAt from '../getters/getStreamRegistryAt'
import { toast } from 'react-toastify'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
import { ROOM_PREFIX } from './useExistingRooms'

const StreamRegistryAddress = '0x0D483E10612F327FC11965Fc82E90dC19b141641'

type ListenerParams = () => Promise<void>

export default function useInvitationListener(): ListenerParams {
    const { account, ethereumProvider } = useStore()

    return useCallback(async () => {
        if (!ethereumProvider || !account) {
            return
        }

        const streamRegistry = getStreamRegistryAt({
            address: StreamRegistryAddress,
            ethereumProvider,
        })

        const filter = streamRegistry.filters.PermissionUpdated()

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
                const message = `You have been invited to join room ${roomName}`
                console.info(message)
                toast.info(message, {
                    position: 'top-center' as 'top-center',
                    autoClose: false as false,
                    progress: undefined,
                })
            }
        )
    }, [account, ethereumProvider])
}
