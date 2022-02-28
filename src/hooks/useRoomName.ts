import { useStore } from '../components/Store'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
import { RoomId } from '../utils/types'

export default function useRoomName(roomId: RoomId): string {
    const { roomNames } = useStore()
    return roomNames[roomId]
        ? roomNames[roomId] || getRoomNameFromRoomId(roomId)
        : ''
}
