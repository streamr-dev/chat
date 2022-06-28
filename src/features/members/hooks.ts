import { selectFlag } from '$/features/flag/selectors'
import { Flag } from '$/features/flag/types'
import { useSelector } from 'react-redux'
import { RoomId } from '../room/types'
import { selectMembers } from './selectors'

export function useMembers(roomId: undefined | RoomId) {
    return useSelector(selectMembers(roomId))
}

export function useMembersFetching(roomId: undefined | RoomId) {
    return useSelector(selectFlag(roomId ? Flag.areMembersBeingFetched(roomId) : undefined))
}
