import { useStore } from '../components/Store'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'

export default function useRoomName(): string {
    const { roomId, roomNames } = useStore()

    return roomId ? roomNames[roomId] || getRoomNameFromRoomId(roomId) : ''
}
