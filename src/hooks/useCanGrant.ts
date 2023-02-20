import { StreamPermission } from 'streamr-client'
import useAbility from '$/hooks/useAbility'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useJustInvited from './useJustInvited'

export default function useCanGrant() {
    const address = useWalletAccount()

    const selectedRoomId = useSelectedRoomId()

    const canGrant = useAbility(selectedRoomId, address, StreamPermission.GRANT)

    const justInvited = useJustInvited(selectedRoomId, address)

    return canGrant && !justInvited
}
