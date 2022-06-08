import { useMemo } from 'react'
import { StreamPermission } from 'streamr-client'
import { OptionalAddress } from '../../types/common'
import { usePermissions } from '../features/permission/hooks'
import { RoomId } from '../features/room/types'

export default function useJustInvited(roomId: undefined | RoomId, address: OptionalAddress) {
    const permissions = usePermissions(roomId, address)

    return useMemo(() => {
        if (permissions[StreamPermission.GRANT]?.value !== true) {
            // Invited people start off with `GRANT` only. If it's not there then we can skip
            // right away.
            return false
        }

        return !Object.entries(permissions).find(
            ([permission, { value }]) => permission !== StreamPermission.GRANT && value
        )
    }, [permissions])
}
