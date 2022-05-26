import { useSelector } from 'react-redux'
import {
    selectRoom,
    selectRoomIds,
    selectRoomName,
    selectRoomRecentMessage,
    selectSelectedRoomId,
} from './selectors'
import { Room, RoomId } from './types'

export function useRoomIds() {
    return useSelector(selectRoomIds)
}

export function useRoomName(id: RoomId) {
    return useSelector(selectRoomName(id))
}

export function useRoomRecentMessage(id: RoomId) {
    return useSelector(selectRoomRecentMessage(id))
}

export function useSelectedRoomId() {
    return useSelector(selectSelectedRoomId)
}

export function useSelectedRoom(): undefined | Room {
    const selectedRoomId = useSelector(selectSelectedRoomId)

    if (!selectedRoomId) {
        return undefined
    }

    return useSelector(selectRoom(selectedRoomId))
}
