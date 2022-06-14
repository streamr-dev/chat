import { useSelector } from 'react-redux'
import { OptionalAddress } from '$/types'
import {
    selectIsBeingAdded,
    selectIsBeingRemoved,
    selectIsDelegatedAccountBeingPromoted,
    selectIsInviteBeingAccepted,
    selectNoticedAt,
} from './selectors'
import { RoomId } from '$/features/room/types'

export function useNoticedAt(address: OptionalAddress): number {
    return useSelector(selectNoticedAt(address)) || Number.NEGATIVE_INFINITY
}

export function useIsMemberBeingRemoved(roomId: undefined | RoomId, address: OptionalAddress) {
    return useSelector(selectIsBeingRemoved(roomId, address))
}

export function useIsMemberBeingAdded(roomId: undefined | RoomId, address: OptionalAddress) {
    return useSelector(selectIsBeingAdded(roomId, address))
}

export function useIsInviteBeingAccepted(roomId: undefined | RoomId, address: OptionalAddress) {
    return useSelector(selectIsInviteBeingAccepted(roomId, address))
}

export function useIsDelegatedAccountBeingPromoted(
    roomId: undefined | RoomId,
    delegatedAddress: OptionalAddress
) {
    return useSelector(selectIsDelegatedAccountBeingPromoted(roomId, delegatedAddress))
}
