import { Flag } from '$/features/flag/types'
import { RoomId } from '$/features/room/types'
import useFlag from '$/hooks/useFlag'
import { OptionalAddress } from '$/types'

export default function useIsMemberBeingRemoved(
    roomId: undefined | RoomId,
    address: OptionalAddress
) {
    return useFlag(roomId && address ? Flag.isMemberBeingRemoved(roomId, address) : undefined)
}
