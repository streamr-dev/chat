import { useCallback } from 'react'
import { StreamrClient } from 'streamr-client'
import { ActionType, useDispatch, useStore } from '../components/Store'
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

            await stream.delete()

            dispatch({
                type: ActionType.RemoveRoomId,
                payload: roomId,
            })
        },
        [ethereumProvider, dispatch]
    )
}
