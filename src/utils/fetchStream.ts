import { RoomId } from '$/features/room/types'
import type StreamrClient from 'streamr-client'
import type { Stream } from 'streamr-client'

export default async function fetchStream(roomId: RoomId, streamrClient: StreamrClient) {
    try {
        const stream: Stream = await streamrClient.getStream(roomId)

        return stream
    } catch (e: any) {
        if (!/NOT_FOUND/.test(e?.message || '')) {
            throw e
        }
    }

    return null
}
