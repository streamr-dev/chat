import { RoomId } from '$/features/room/types'
import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectCachedTokenGate(roomId: RoomId | undefined) {
    if (!roomId) {
        return () => undefined
    }

    return ({ room }: State) => room.cache[roomId]?.tokenGate
}

export default function useCachedTokenGate(roomId: RoomId | undefined) {
    return useSelector(selectCachedTokenGate(roomId))
}
