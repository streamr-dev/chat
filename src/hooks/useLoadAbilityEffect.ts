import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { RoomId } from '$/features/room/types'
import { useWalletClient } from '$/features/wallet/hooks'
import useAbilityCache from '$/hooks/useAbilityCache'
import { OptionalAddress } from '$/types'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { StreamPermission } from 'streamr-client'

export default function useLoadAbilityEffect(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    const dispatch = useDispatch()

    const cache = useAbilityCache(roomId, address, permission)

    const streamrClient = useWalletClient()

    useEffect(() => {
        if (!roomId || !address || !streamrClient) {
            return
        }

        dispatch(
            PermissionsAction.fetchPermission({
                roomId,
                address,
                permission,
                streamrClient,
                fingerprint: Flag.isPermissionBeingFetched(roomId, address, permission),
            })
        )
    }, [roomId, address, permission, cache, streamrClient])
}
