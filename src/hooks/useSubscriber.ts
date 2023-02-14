import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import { usePrivacy } from '$/features/room/hooks'
import { RoomId } from '$/features/room/types'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import useAbility from '$/hooks/useAbility'
import { PrivacySetting } from '$/types'
import { StreamPermission } from 'streamr-client'

/**
 * Returns an instance of `StreamrClient` associated with the entity (account)
 * that's permitted to subscribe to the room identified by the given id.
 */
export default function useSubscriber(roomId: RoomId | undefined) {
    const mainClient = useWalletClient()

    const canMainSubscribe = !!useAbility(roomId, useWalletAccount(), StreamPermission.SUBSCRIBE)

    const hotClient = useDelegatedClient()

    const canHotSubscribe = !!useAbility(roomId, useDelegatedAccount(), StreamPermission.SUBSCRIBE)

    if (usePrivacy(roomId) === PrivacySetting.Public && canMainSubscribe) {
        return mainClient
    }

    if (canHotSubscribe) {
        return hotClient
    }
}
