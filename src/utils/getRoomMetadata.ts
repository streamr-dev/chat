import { IRoom } from '$/features/room/types'
import type { Stream, StreamMetadata } from 'streamr-client'

export type RoomMetadata = Omit<
    IRoom,
    'id' | 'name' | 'owner' | 'hidden' | 'pinned' | 'recentMessageAt'
>

export default function getRoomMetadata(stream: Stream) {
    const {
        description: name,
        extensions,
    }: StreamMetadata & { extensions?: Partial<Record<'thechat.eth', Partial<RoomMetadata>>> } =
        stream.getMetadata()

    return {
        ...(extensions?.['thechat.eth'] || {}),
        name,
    }
}
