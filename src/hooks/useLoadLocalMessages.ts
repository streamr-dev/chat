import { useCallback } from 'react'
import { useStore } from '../components/Store'
import { db } from '../utils/db'
import { MessagePayload } from '../utils/types'

type MessageLoader = () => Promise<MessagePayload[]>

export default function useLoadLocalMessages(): MessageLoader {
    const { roomId } = useStore()

    return useCallback(async () => {
        if (!roomId) {
            return []
        }

        const messages = await db.messages
            .where('roomId')
            .equals(roomId)
            .toArray()
        const roomMessages = messages.map(
            (m) => JSON.parse(m.serialized) as MessagePayload
        )

        return roomMessages
    }, [roomId])
}
