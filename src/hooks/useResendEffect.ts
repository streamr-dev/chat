import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import useAbility from '$/hooks/useAbility'
import useLoadAbilityEffect from '$/hooks/useLoadAbilityEffect'
import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import getBeginningOfDay from '$/utils/getBeginningOfDay'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import useRoomSubscriber from '$/hooks/useRoomSubscriber'

export default function useResendEffect(roomId: undefined | RoomId) {
    const [account, streamrClient] = useRoomSubscriber(roomId)

    const canSubscriberSubscribe = useAbility(roomId, account, StreamPermission.SUBSCRIBE)

    useLoadAbilityEffect(roomId, account, StreamPermission.SUBSCRIBE)

    const requester = useWalletAccount()?.toLowerCase()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!roomId || !requester || !streamrClient || !canSubscriberSubscribe) {
            return
        }

        dispatch(
            MessageAction.resend({
                roomId,
                requester,
                streamrClient,
                fingerprint: Flag.isResendingMessage(roomId, requester),
            })
        )

        dispatch(
            MessageAction.setFromTimestamp({
                roomId,
                requester,
                timestamp: getBeginningOfDay(Date.now()),
            })
        )
    }, [roomId, streamrClient, canSubscriberSubscribe, requester])
}
