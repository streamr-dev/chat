import { RoomMetadata } from '../utils/types'

export default function getRoomMetadata(description: string): RoomMetadata {
    return JSON.parse(description)
}
