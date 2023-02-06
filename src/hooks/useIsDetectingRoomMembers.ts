import { Flag } from '$/features/flag/types'
import { RoomId } from '$/features/room/types'
import useFlag from '$/hooks/useFlag'

export default function useIsDetectingRoomMembers(roomId: undefined | RoomId) {
    return useFlag(roomId ? Flag.isDetectingMembers(roomId) : undefined)
}
