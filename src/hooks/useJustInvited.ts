import { useMemo } from 'react'
import { StreamPermission } from '@streamr/sdk'
import { OptionalAddress } from '$/types'
import usePermissions from '$/hooks/usePermissions'
import { RoomId } from '$/features/room/types'

export default function useJustInvited(roomId: undefined | RoomId, address: OptionalAddress) {
    const permissions = usePermissions(roomId, address)

    return useMemo(() => {
        if (permissions[StreamPermission.GRANT]?.value !== true) {
            return false
        }

        if (permissions[StreamPermission.SUBSCRIBE]?.value !== true) {
            return false
        }

        return !Object.entries(permissions).find(
            ([permission, { value }]) =>
                permission !== StreamPermission.GRANT &&
                permission !== StreamPermission.SUBSCRIBE &&
                value
        )
    }, [permissions])
}
