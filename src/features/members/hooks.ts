import { selectFlag } from '$/features/flag/selectors'
import { MembersAction } from '$/features/members'
import formatFingerprint from '$/utils/formatFingerprint'
import { useSelector } from 'react-redux'
import { RoomId } from '../room/types'
import { selectMembers } from './selectors'

export function useMembers(roomId: undefined | RoomId) {
    return useSelector(selectMembers(roomId))
}

export function useMembersFetching(roomId: undefined | RoomId) {
    return useSelector(
        selectFlag(roomId ? formatFingerprint(MembersAction.detect.toString(), roomId) : undefined)
    )
}
