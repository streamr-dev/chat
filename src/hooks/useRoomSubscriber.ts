import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import { usePrivacy } from '$/features/room/hooks'
import { RoomId } from '$/features/room/types'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import { OptionalAddress, PrivacySetting } from '$/types'
import type StreamrClient from 'streamr-client'

export default function useRoomSubscriber(
    roomId: undefined | RoomId
): [] | [OptionalAddress, undefined | StreamrClient] {
    const mainClient = useWalletClient()

    const mainAccount = useWalletAccount()

    const privacy = usePrivacy(roomId)

    const delegatedAccount = useDelegatedAccount()

    const delegatedClient = useDelegatedClient()

    if (delegatedClient) {
        return [delegatedAccount, delegatedClient]
    }

    if (privacy === PrivacySetting.Public) {
        return [mainAccount, mainClient]
    }

    return []
}
