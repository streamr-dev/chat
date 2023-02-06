import { RoomId } from '$/features/room/types'
import { OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'
import type { StreamPermission } from 'streamr-client'

function selectPermissionCache(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    if (!roomId || !address) {
        return () => 0
    }

    return (state: State) =>
        state.permissions.permissions[roomId]?.[address.toLowerCase()]?.[permission]?.cache || 0
}

export default function useAbilityCache(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    return useSelector(selectPermissionCache(roomId, address, permission))
}
