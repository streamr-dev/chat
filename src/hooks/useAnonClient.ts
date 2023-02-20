import { RoomId } from '$/features/room/types'
import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectAnonClient(roomId: RoomId | undefined) {
    return ({ anon }: State) => {
        if (!roomId) {
            return undefined
        }

        return anon.rooms[roomId]?.client
    }
}

export default function useAnonClient(roomId: RoomId | undefined) {
    return useSelector(selectAnonClient(roomId))
}
