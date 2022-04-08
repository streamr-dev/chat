import { memo, useEffect, useRef } from 'react'
import { useStore } from '../../Store'
import { useSend } from './MessageTransmitter'
import { StreamMessage } from 'streamr-client-protocol'
import { MessageType } from '../../../utils/types'

type Props = {
    streamId: string
    //messageType: MessageType
    onTextMessage: (data: any, raw: any) => void
    onMetadataMessage: (data: any, raw: any) => void
}

type MessagePresenceMap = {
    [index: string]: true
}

const EmptyMessagePresenceMap = {}

const MessageInterceptor = memo(
    ({
        streamId,
        onTextMessage: onTextMessageProp,
        onMetadataMessage: onMetadataMessageProp,
    }: Props) => {
        const {
            session: { streamrClient },
            account,
        } = useStore()

        const messagesRef = useRef<MessagePresenceMap>(EmptyMessagePresenceMap)
        const send = useSend()

        useEffect(() => {
            messagesRef.current = EmptyMessagePresenceMap
        }, [streamId])

        const onTextMessageRef = useRef(onTextMessageProp)
        const onMetadataMessageRef = useRef(onMetadataMessageProp)

        useEffect(() => {
            onTextMessageRef.current = onTextMessageProp
            onMetadataMessageRef.current = onMetadataMessageProp
        }, [onTextMessageProp, onMetadataMessageProp])

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
                try {
                    sub = await streamrClient!.subscribe(
                        {
                            streamId,
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

                            const { current: onTextMessage } = onTextMessageRef
                            const { current: onMetadataMessage } =
                                onMetadataMessageRef

                            switch (data.type) {
                                case MessageType.Text:
                                    onTextMessage(data, raw)
                                    break
                                case MessageType.Metadata:
                                    onMetadataMessage(data, raw)
                                    break
                                default:
                                    console.error(
                                        'Unknown message type',
                                        data.type
                                    )
                                    break
                            }
                        }
                    )
                } catch (e: any) {
                    console.warn(`Error subscribing to stream ${streamId}:`)
                }

                console.info('subscribed to stream', streamId)

                if (!mounted) {
                    unsub()
                }
            }

            fn()

            return () => {
                mounted = false
                unsub()
            }
        }, [streamId, streamrClient, account, send])

        return null
    }
)

export default MessageInterceptor
