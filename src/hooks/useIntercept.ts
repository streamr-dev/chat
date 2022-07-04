import { useCallback, useEffect } from 'react'
import { RoomId } from '$/features/room/types'
import { MessageStreamOnMessage } from 'streamr-client'
import handleError from '$/utils/handleError'
import { useDispatch } from 'react-redux'
import { useDelegatedClient } from '$/features/delegation/hooks'
import { IMessage, StreamMessage } from '$/features/message/types'
import { MessageAction } from '$/features/message'
import { useWalletAccount } from '$/features/wallet/hooks'

export default function useIntercept(roomId: RoomId) {
    const client = useDelegatedClient()

    const dispatch = useDispatch()

    const owner = useWalletAccount()

    const onMessage = useCallback(
        (message: Omit<IMessage, 'owner'>) => {
            if (!owner) {
                return
            }

            dispatch(
                MessageAction.register({
                    message,
                    owner,
                })
            )
        },
        [owner]
    )

    useEffect(() => {
        let mounted = true

        let sub: any

        function unsub() {
            if (client && sub) {
                client.unsubscribe(sub)
            }

            sub = undefined
        }

        const onData: MessageStreamOnMessage<StreamMessage, void> = (
            { id, createdBy, content },
            { messageId: { timestamp: createdAt } }
        ) => {
            if (!mounted) {
                return
            }

            onMessage({
                createdAt,
                createdBy,
                content,
                updatedAt: createdAt,
                id,
                roomId,
            })
        }

        async function fn() {
            if (!client || !mounted) {
                return
            }

            try {
                sub = await client.subscribe(
                    {
                        streamId: roomId,
                        resend: { last: 50 },
                    },
                    onData
                )

                sub.onError(handleError)
            } catch (e) {
                handleError(e)
            }

            if (!mounted) {
                unsub()
            }
        }

        fn()

        return () => {
            mounted = false
            unsub()
        }
    }, [client, roomId, onMessage])
}
