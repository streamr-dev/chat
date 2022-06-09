import { useEffect, useRef } from 'react'
import { RoomId } from '$/features/room/types'
import { MessageStreamOnMessage } from 'streamr-client'
import handleError from '$/utils/handleError'
import { useDispatch } from 'react-redux'
import { useDelegatedClient } from '$/features/delegation/hooks'
import { IMessage, MessageType, StreamMessage } from '$/features/message/types'
import { MessageAction } from '$/features/message'

export default function useIntercept(roomId: RoomId) {
    const client = useDelegatedClient()

    const dispatch = useDispatch()

    const { current: onMessage } = useRef((type: MessageType, message: Omit<IMessage, 'owner'>) => {
        dispatch(
            MessageAction.register({
                type,
                message,
            })
        )
    })

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
            { id, createdBy, content, type },
            { messageId: { timestamp: createdAt } }
        ) => {
            if (!mounted) {
                return
            }

            onMessage(type, {
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
