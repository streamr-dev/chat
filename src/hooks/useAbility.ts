import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { RoomId } from '$/features/room/types'
import { OptionalAddress, State } from '$/types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { StreamPermission } from '@streamr/sdk'

function selectAbility(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    if (!roomId || !address) {
        return () => undefined
    }

    return (state: State) =>
        state.permissions.permissions[roomId]?.[address.toLowerCase()]?.[permission]?.value
}

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

export default function useAbility(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    const dispatch = useDispatch()

    const cache = useSelector(selectPermissionCache(roomId, address, permission))

    useEffect(() => {
        if (!roomId || !address) {
            return
        }

        dispatch(
            PermissionsAction.fetchPermission({
                roomId,
                address,
                permission,
                fingerprint: Flag.isPermissionBeingFetched(roomId, address, permission),
            })
        )
    }, [roomId, address, permission, cache])

    return useSelector(selectAbility(roomId, address, permission))
}
