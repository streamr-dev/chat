import { useSelector } from 'react-redux'
import { RoomId } from '../rooms/types'
import { selectMembers } from './selectors'

export function useMembers(roomId: undefined | RoomId): string[] {
    return useSelector(selectMembers(roomId))
}
