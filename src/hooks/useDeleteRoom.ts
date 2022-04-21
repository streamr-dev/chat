import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { StreamrClient } from 'streamr-client'
import { ActionType, useDispatch, useStore } from '../components/Store'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
import { RoomId } from '../utils/types'

export default function useDeleteRoom(): (roomId: RoomId) => Promise<void> {
    const dispatch = useDispatch()

    const { ethereumProvider } = useStore()

    return useCallback(
        async (roomId) => {
            const providerClient = new StreamrClient({
                auth: {
                    ethereum: ethereumProvider as any,
                },
            })
            const stream = await providerClient.getStream(roomId)
            const roomName = getRoomNameFromRoomId(roomId)
            toast.info(`Deleting room ${roomName}`, {
                position: 'top-center',
            })
            await stream.delete()
            toast.success(`Successfully deleted room ${roomName}`, {
                position: 'top-center',
            })

            dispatch({
                type: ActionType.RemoveRoomId,
                payload: roomId,
            })
        },
        [ethereumProvider, dispatch]
    )
}
