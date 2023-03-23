import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useAcceptInvite() {
    const dispatch = useDispatch()

    const roomId = useSelectedRoomId()

    const member = useWalletAccount()

    const requester = useWalletAccount()

    return useCallback(() => {
        if (!member || !roomId || !requester) {
            return
        }

        dispatch(
            PermissionsAction.acceptInvite({
                member,
                roomId,
                requester,
                fingerprint: Flag.isInviteBeingAccepted(roomId, member),
            })
        )
    }, [member, roomId, requester])
}
