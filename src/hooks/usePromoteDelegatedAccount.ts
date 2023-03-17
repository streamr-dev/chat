import { useDelegatedAccount } from '$/features/delegation/hooks'
import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import usePrivacy from '$/hooks/usePrivacy'
import { useWalletAccount } from '$/features/wallet/hooks'
import { PrivacySetting } from '$/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function usePromoteDelegatedAccount() {
    const dispatch = useDispatch()

    const roomId = useSelectedRoomId()

    const delegatedAddress = useDelegatedAccount()

    const requester = useWalletAccount()

    const privacy = usePrivacy(roomId)

    const cb = useCallback(() => {
        if (!roomId || !delegatedAddress || !requester) {
            return
        }

        dispatch(
            PermissionsAction.promoteDelegatedAccount({
                roomId,
                delegatedAddress,
                requester,
                fingerprint: Flag.isDelegatedAccountBeingPromoted(roomId, delegatedAddress),
            })
        )
    }, [roomId, delegatedAddress, requester])

    if (privacy === PrivacySetting.Private || privacy === PrivacySetting.Public) {
        return cb
    }
}
