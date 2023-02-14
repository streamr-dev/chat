import { RoomId } from '$/features/room/types'
import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectAnonAccount(roomId: RoomId | undefined) {
    return ({ anon }: State) => {
        if (!roomId) {
            return undefined
        }

        return anon.rooms[roomId]?.wallet.address
    }
}

export default function useAnonAccount(roomId: RoomId | undefined) {
    return useSelector(selectAnonAccount(roomId))
}
