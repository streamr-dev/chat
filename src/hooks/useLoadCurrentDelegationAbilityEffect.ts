import { useDelegatedAccount } from '$/features/delegation/hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import useLoadAbilityEffect from '$/hooks/useLoadAbilityEffect'
import type { StreamPermission } from 'streamr-client'

export default function useLoadCurrentDelegationAbilityEffect(permission: StreamPermission) {
    useLoadAbilityEffect(useSelectedRoomId(), useDelegatedAccount(), permission)
}
