import { StreamPermission } from 'streamr-client'
import { useCurrentAbility, useLoadCurrentAbilityEffect } from '$/features/permission/hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useJustInvited from './useJustInvited'

export default function useCanGrant() {
    const canGrant = useCurrentAbility(StreamPermission.GRANT)

    const address = useWalletAccount()

    const selectedRoomId = useSelectedRoomId()

    const justInvited = useJustInvited(selectedRoomId, address)

    useLoadCurrentAbilityEffect(StreamPermission.GRANT)

    return canGrant && !justInvited
}
