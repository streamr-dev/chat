import { Stream } from 'streamr-client'
import { RoomMetadata } from '../utils/types'

export default function getRoomDescription(stream: Stream): RoomMetadata {
    const jsonDescription = stream.description!
    const description: RoomMetadata = JSON.parse(jsonDescription)
    return description
}
