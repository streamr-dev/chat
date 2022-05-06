import { BigNumber } from 'ethers'
import { toast } from 'react-toastify'
import getStreamRegistryAt from '../../../../getters/getStreamRegistryAt'
import getRoomNameFromRoomId from '../../../../getters/getRoomNameFromRoomId'
import { ROOM_PREFIX } from '../../../../hooks/useExistingRooms'

let streamRegistry: any

let filter: any

const StreamRegistryAddress = '0x0D483E10612F327FC11965Fc82E90dC19b141641'

type Options = {
    onAccept?: (streamId: string) => void | Promise<void>
}

export default function listenForInvites(
    account: string | undefined | null,
    { onAccept }: Options = {}
): () => void {
    if (!account) {
        return () => {}
    }

    if (!streamRegistry) {
        streamRegistry = getStreamRegistryAt(StreamRegistryAddress)
    }

    if (!filter) {
        // Typing for the event filter requires all arguments to be nulled out.
        filter = streamRegistry.filters.PermissionUpdated(
            // streamId
            null,
            // user
            null,
            // canEdit
            null,
            // canDelete
            null,
            // publishExpiration
            null,
            // subscribeExpiration
            null,
            // canGrant
            null
        )
    }

    function onData(
        streamId: string,
        userAddress: string,
        _canEdit: boolean,
        _canDelete: boolean,
        _publishExpirationTimestampSeconds: BigNumber,
        _subscribeExpirationTimestampSeconds: BigNumber,
        canGrant: boolean
    ) {
        const user = userAddress.toLowerCase()

        if (!canGrant || user !== account || !streamId.includes(ROOM_PREFIX)) {
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
                    try {
                        if (typeof onAccept === 'function') {
                            await onAccept(streamId)
                        }
                    } finally {
                        toast.dismiss()
                    }
                },
            }
        )
    }

    streamRegistry.on(filter, onData)

    return () => {
        streamRegistry.off(filter, onData)
    }
}
