import { useSelector } from 'react-redux'
import { RoomId } from '../room/types'
import { selectFetching, selectMembers } from './selectors'

export function useMembers(roomId: undefined | RoomId) {
    return useSelector(selectMembers(roomId))
}

export function useMembersFetching(roomId: undefined | RoomId) {
    return useSelector(selectFetching(roomId))
}
