import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useAcceptInvite() {
    const dispatch = useDispatch()

    const roomId = useSelectedRoomId()

    const member = useWalletAccount()

    const provider = useWalletProvider()

    const requester = useWalletAccount()

    const streamrClient = useWalletClient()

    return useCallback(() => {
        if (!member || !roomId || !provider || !requester || !streamrClient) {
            return
        }

        dispatch(
            PermissionsAction.acceptInvite({
                member,
                roomId,
                provider,
                requester,
                streamrClient,
                fingerprint: Flag.isInviteBeingAccepted(roomId, member),
            })
        )
    }, [member, roomId, provider, requester, streamrClient])
}
