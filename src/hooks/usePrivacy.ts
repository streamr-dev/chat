import { RoomId } from '$/features/room/types'
import { PrivacySetting, State } from '$/types'
import { useSelector } from 'react-redux'

function selectPrivacy(roomId: undefined | RoomId) {
    return (state: State) =>
        (roomId ? state.room.cache[roomId]?.privacy : undefined) || PrivacySetting.Private
}

export default function usePrivacy(roomId: undefined | RoomId) {
    return useSelector(selectPrivacy(roomId))
}
