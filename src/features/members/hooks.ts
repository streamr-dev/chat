import { useSelector } from 'react-redux'
import { OptionalAddress } from '../../../types/common'
import { RoomId } from '../rooms/types'
import { selectLastSeenAt, selectMembers } from './selectors'

export function useMembers(roomId: undefined | RoomId): string[] {
    return useSelector(selectMembers(roomId))
}

export function useLastSeenAt(address: OptionalAddress): number {
    return useSelector(selectLastSeenAt(address)) || Number.NEGATIVE_INFINITY
}
