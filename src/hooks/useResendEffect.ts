import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import getBeginningOfDay from '$/utils/getBeginningOfDay'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useSubscriber from '$/hooks/useSubscriber'

export default function useResendEffect(roomId: undefined | RoomId) {
    const streamrClient = useSubscriber(roomId)

    const requester = useWalletAccount()?.toLowerCase()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!roomId || !requester || !streamrClient) {
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
    }, [roomId, streamrClient, requester])
}
