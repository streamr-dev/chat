import StreamrClient, { Stream, StreamProperties } from 'streamr-client'
import { IRoom } from '../features/rooms/types'

export default async function createRoomStream(
    client: StreamrClient,
    { id, name: description, ...metadata }: Omit<IRoom, 'owner'>
) {
    const stream: Stream = await client.createStream({
        id,
        description,
        extensions: {
            'thechat.eth': metadata,
        },
    } as StreamProperties)

    return stream
}
