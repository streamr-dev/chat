import { RoomId } from '../utils/types'

export default function getRoomNameFromRoomId(streamId: RoomId): string {
    try {
        return streamId.split('/')[3]
    } catch (e) {
        // die silently, return the streamId
        return streamId
    }
}
