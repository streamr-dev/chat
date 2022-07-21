import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import { MessageAction } from '$/features/message'
import { useAbility, useLoadAbilityEffect } from '$/features/permission/hooks'
import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'

export default function useResendEffect(roomId: undefined | RoomId) {
    const streamrClient = useDelegatedClient()

    const delegatedAddress = useDelegatedAccount()

    const canDelegatedSubscribe = useAbility(roomId, delegatedAddress, StreamPermission.SUBSCRIBE)

    useLoadAbilityEffect(roomId, delegatedAddress, StreamPermission.SUBSCRIBE)

    const account = useWalletAccount()?.toLowerCase()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!roomId || !account || !streamrClient) {
            return
        }

        dispatch(
            MessageAction.resend({
                roomId,
                requester: account,
                streamrClient,
            })
        )
    }, [roomId, streamrClient, canDelegatedSubscribe, account])
}
