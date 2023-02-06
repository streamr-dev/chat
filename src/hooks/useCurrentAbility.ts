import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useAbility from '$/hooks/useAbility'
import type { StreamPermission } from 'streamr-client'

export default function useCurrentAbility(permission: StreamPermission) {
    return useAbility(useSelectedRoomId(), useWalletAccount(), permission)
}
