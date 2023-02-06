import { RoomId } from '$/features/room/types'
import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectRoomMembers(roomId: undefined | RoomId) {
    return (state: State) => {
        return (roomId ? state.permissions.roomMembers[roomId] : undefined) || []
    }
}

export default function useRoomMembers(roomId: undefined | RoomId) {
    return useSelector(selectRoomMembers(roomId))
}
