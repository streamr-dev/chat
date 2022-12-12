import StreamrClient, { Stream } from 'streamr-client'
import { IRoom } from '$/features/room/types'

export default async function createRoomStream(
    client: StreamrClient,
    { id, name: description, ...metadata }: Omit<IRoom, 'owner'>
): Promise<Stream> {
    const stream: Stream = await client.createStream({
        id,
        description,
        extensions: {
            'thechat.eth': metadata,
        },
    } as any)

    return stream
}
