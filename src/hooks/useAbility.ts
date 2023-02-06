import { RoomId } from '$/features/room/types'
import { OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'
import type { StreamPermission } from 'streamr-client'

function selectAbility(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    if (!roomId || !address) {
        return () => false
    }

    return (state: State) =>
        Boolean(state.permissions.permissions[roomId]?.[address.toLowerCase()]?.[permission]?.value)
}

export default function useAbility(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
): boolean {
    return useSelector(selectAbility(roomId, address, permission))
}
