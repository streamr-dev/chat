import { useStore } from '../components/Store'

export default function useRoomName(): string {
    const { roomId, roomNames } = useStore()
    return roomId ? /*roomNames[roomId] ||*/ roomId?.split('/')[3] : ''
}
