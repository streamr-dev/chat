import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import useAbility from '$/hooks/useAbility'
import useAnonAccount from '$/hooks/useAnonAccount'
import useAnonClient from '$/hooks/useAnonClient'
import { StreamPermission } from 'streamr-client'

export enum PublisherState {
    Unavailable,
    NeedsDelegation,
    NeedsPermission,
}

export default function usePublisher(roomId: RoomId | undefined) {
    const anonClient = useAnonClient(roomId)

    const anonAccount = useAnonAccount(roomId)

    const canAnonPublish = useAbility(roomId, anonAccount, StreamPermission.PUBLISH)

    const hotClient = useDelegatedClient()

    const hotAccount = useDelegatedAccount()

    const canHotPublish = !!useAbility(roomId, hotAccount, StreamPermission.PUBLISH)

    const mainAccount = useWalletAccount()

    const canMainPublish = !!useAbility(roomId, mainAccount, StreamPermission.PUBLISH)

    const canMainGrant = !!useAbility(roomId, mainAccount, StreamPermission.GRANT)

    if (typeof canAnonPublish === 'undefined') {
        /**
         * We're still figuring out if anon can publish. We cannot let the delegated client
         * take over in the mean time – we don't wanna lose our anonymous disguise
         * even for a moment!
         */
        return PublisherState.Unavailable
    }

    if (canAnonPublish) {
        /**
         * Anon client is created together with the anon account. If one exists, both exist. And
         * `canAnonPublish` can only be positive if `anonAccount` is present. Bang!
         */
        return anonClient!
    }

    if (!hotClient) {
        if (canMainPublish) {
            return PublisherState.NeedsDelegation
        }
    } else {
        if (canHotPublish) {
            /**
             * Again, hot client is created together with the hot account. If one exists,
             * both exist. And `canHotPublish` can only be positive if `hotAccount`
             * is present. Another bang!
             */
            return hotClient!
        }

        if (canMainGrant) {
            return PublisherState.NeedsPermission
        }
    }

    return PublisherState.Unavailable
}
