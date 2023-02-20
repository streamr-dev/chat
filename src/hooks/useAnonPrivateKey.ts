import { RoomId } from '$/features/room/types'
import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectAnonPrivateKey(roomId: RoomId | undefined) {
    return ({ anon }: State) => {
        if (!roomId) {
            return undefined
        }

        return anon.rooms[roomId]?.wallet.privateKey
    }
}

export default function useAnonPrivateKey(roomId: RoomId | undefined) {
    return useSelector(selectAnonPrivateKey(roomId))
}
