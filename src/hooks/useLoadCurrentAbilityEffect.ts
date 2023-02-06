import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useLoadAbilityEffect from '$/hooks/useLoadAbilityEffect'
import type { StreamPermission } from 'streamr-client'

export default function useLoadCurrentAbilityEffect(permission: StreamPermission) {
    useLoadAbilityEffect(useSelectedRoomId(), useWalletAccount(), permission)
}
