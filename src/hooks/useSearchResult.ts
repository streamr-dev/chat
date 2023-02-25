import { RoomId } from '$/features/room/types'
import { State } from '$/types'
import { useSelector } from 'react-redux'

function selectSearchResult(roomId: RoomId) {
    return (state: State) => state.room.searchResults[roomId]
}

export default function useSearchResult(roomId: RoomId) {
    return useSelector(selectSearchResult(roomId))
}
