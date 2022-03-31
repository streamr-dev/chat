import { db } from '../utils/db'
import { MessagePayload, RoomId } from '../utils/types'

export default async function getLocalMessagesForRoom(roomId: RoomId) {
    if (!roomId) {
        return []
    }

    const messages = await db.messages.where('roomId').equals(roomId).toArray()

    return messages.map((m) => JSON.parse(m.serialized) as MessagePayload)
}
