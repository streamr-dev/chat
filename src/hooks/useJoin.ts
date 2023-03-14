import { useDelegatedAccount } from '$/features/delegation/hooks'
import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import usePrivacy from '$/hooks/usePrivacy'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import { PrivacySetting } from '$/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useJoin() {
    const dispatch = useDispatch()

    const roomId = useSelectedRoomId()

    const delegatedAddress = useDelegatedAccount()

    const requester = useWalletAccount()

    const streamrClient = useWalletClient()

    const privacy = usePrivacy(roomId)

    const cb = useCallback(() => {
        if (!roomId || !delegatedAddress || !requester || !streamrClient) {
            return
        }

        dispatch(
            PermissionsAction.join({
                roomId,
                delegatedAddress,
                requester,
                streamrClient,
                fingerprint: Flag.isDelegatedAccountBeingPromoted(roomId, delegatedAddress),
            })
        )
    }, [roomId, delegatedAddress, requester, streamrClient])

    if (privacy === PrivacySetting.TokenGated) {
        return cb
    }
}
