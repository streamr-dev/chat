import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { db } from '../utils/db'
import { MessagePayload } from '../utils/types'

type MessageLoader = () => Promise<void>

export default function useLoadLocalMessages(): MessageLoader {
    const { roomId } = useStore()
    const dispatch = useDispatch()

    return useCallback(async () => {
        if (!roomId) {
            return
        }

        const messages = await db.messages
            .where('roomId')
            .equals(roomId)
            .toArray()
        const roomMessages = messages.map(
            (m) => JSON.parse(m.serialized) as MessagePayload
        )

        dispatch({
            type: ActionType.PrependMessages,
            payload: roomMessages,
        })
    }, [roomId, dispatch])
}
