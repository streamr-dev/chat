import { useEffect, useRef } from 'react'
import { RoomId } from '../features/rooms/types'
import { MessageStreamOnMessage } from 'streamr-client'
import { registerMessage } from '../features/messages/actions'
import handleError from '../utils/handleError'
import { IMessage, MessageType, StreamMessage } from '../features/messages/types'
import { useDispatch } from 'react-redux'
import { useDelegatedClient } from '../features/delegation/hooks'

export default function useIntercept(roomId: RoomId) {
    const client = useDelegatedClient()

    const dispatch = useDispatch()

    const { current: onMessage } = useRef((type: MessageType, message: Omit<IMessage, 'owner'>) => {
        dispatch(
            registerMessage({
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
