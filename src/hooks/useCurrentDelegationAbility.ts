import { useDelegatedAccount } from '$/features/delegation/hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import useAbility from '$/hooks/useAbility'
import type { StreamPermission } from 'streamr-client'

export default function useCurrentDelegationAbility(permission: StreamPermission) {
    return useAbility(useSelectedRoomId(), useDelegatedAccount(), permission)
}
