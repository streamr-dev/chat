import { useDelegatedAccount } from '$/features/delegation/hooks'
import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useAcceptInvite() {
    const dispatch = useDispatch()

    const delegatedAddress = useDelegatedAccount()

    const roomId = useSelectedRoomId()

    const member = useWalletAccount()

    const provider = useWalletProvider()

    const requester = useWalletAccount()

    const streamrClient = useWalletClient()

    return useCallback(() => {
        if (!member || !delegatedAddress || !roomId || !provider || !requester || !streamrClient) {
            return
        }

        dispatch(
            PermissionsAction.acceptInvite({
                member,
                delegatedAddress,
                roomId,
                provider,
                requester,
                streamrClient,
                fingerprint: Flag.isInviteBeingAccepted(roomId, member, delegatedAddress),
            })
        )
    }, [member, delegatedAddress, roomId, provider, requester, streamrClient])
}
