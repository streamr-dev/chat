import { EnhancedStream } from '$/types'
import getStream from '$/utils/getStream'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import { RoomId } from '$/features/room/types'
import { StreamrClient } from 'streamr-client'

export async function isTokenGatedRoom(roomId: RoomId, streamrClient: StreamrClient) {
    if (!roomId || !streamrClient) {
        return
    }
    const stream: undefined | EnhancedStream = await getStream(streamrClient, roomId)

    if (!stream) {
        throw new RoomNotFoundError(roomId)
    }
    const { tokenAddress } = stream.extensions['thechat.eth']
    return tokenAddress !== undefined
}
