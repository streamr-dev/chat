import { memo, useEffect, useRef } from 'react'
import { useStore } from '../../Store'
import { useSend } from './MessageTransmitter'
import { StreamMessage } from 'streamr-client-protocol'
import getRoomMetadata from '../../../getters/getRoomMetadata'
import { MessageType } from '../../../utils/types'

type Props = {
    streamId: string
    messageType: MessageType
    onMessage: (data: any, raw: any) => void
}

type MessagePresenceMap = {
    [index: string]: true
}

const EmptyMessagePresenceMap = {}

const MessageInterceptor = memo(
    ({ streamId, messageType, onMessage: onMessageProp }: Props) => {
        const {
            session: { streamrClient },
            account,
        } = useStore()

        const messagesRef = useRef<MessagePresenceMap>(EmptyMessagePresenceMap)
        const send = useSend()

        useEffect(() => {
            messagesRef.current = EmptyMessagePresenceMap
        }, [streamId])

        const onMessageRef = useRef(onMessageProp)

        useEffect(() => {
            onMessageRef.current = onMessageProp
        }, [onMessageProp])

        useEffect(() => {
            let mounted = true

            let sub: any

            if (!streamrClient) {
                return () => {}
            }

            function unsub() {
                if (sub) {
                    streamrClient!.unsubscribe(sub)
                    sub = undefined
                    console.info('unsubscribed from stream', streamId)
                }
            }

            async function fn() {
                const stream = await streamrClient!.getStream(streamId)
                const { privacy } = getRoomMetadata(stream.description!)
                // prevent subscribing on metadata for public and view-only rooms
                if (
                    privacy !== 'private' &&
                    messageType !== MessageType.Text
                ) {
                    return
                }
                try {
                    sub = await streamrClient!.subscribe(
                        {
                            streamId
                        },
                        (data: any, raw: StreamMessage) => {
                            if (!mounted) {
                                return
                            }

                            if (messagesRef.current[data.id]) {
                                // Message with such id already exists. Suppress.
                                return
                            }

                            messagesRef.current[data.id] = true

                            const { current: onMessage } = onMessageRef

                            if (typeof onMessage === 'function') {
                                onMessage(data, raw)
                            }
                        }
                    )
                } catch (e: any) {
                    console.warn(`Error subscribing to stream ${streamId}:`)
                }

                console.info(
                    'subscribed to stream',
                    streamId )

                if (!mounted) {
                    unsub()
                }
            }

            fn()

            return () => {
                mounted = false
                unsub()
            }
        }, [streamId, messageType, streamrClient, account, send])

        return null
    }
)

export default MessageInterceptor
