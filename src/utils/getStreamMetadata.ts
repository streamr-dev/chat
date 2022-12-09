import { IRoom } from '$/features/room/types'
import { Stream } from 'streamr-client'

export default function getStreamMetadata(stream: Stream): IRoom {
    const rawMetadata = stream.getMetadata() as any

    return {
        ...rawMetadata.extensions['thechat.eth'],
        name: rawMetadata.description,
    }
}
