import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import useAbility from '$/hooks/useAbility'
import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import getBeginningOfDay from '$/utils/getBeginningOfDay'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import useOperator from '$/hooks/useOperator'

export default function useResendEffect(roomId: undefined | RoomId) {
    const [account, streamrClient] = useOperator(roomId)

    const canOperatorSubscribe = useAbility(roomId, account, StreamPermission.SUBSCRIBE)

    const requester = useWalletAccount()?.toLowerCase()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!roomId || !requester || !streamrClient || !canOperatorSubscribe) {
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
    }, [roomId, streamrClient, canOperatorSubscribe, requester])
}
