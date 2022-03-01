import { memo, useEffect, useRef } from 'react'
import { MessageType, Partition } from '../../../utils/types'
import { useStore } from '../../Store'
import { useSend } from './MessageTransmitter'
import { MetadataType } from './MessageAggregator'
import { db } from '../../../utils/db'
import { StreamMessage } from 'streamr-client-protocol'

type Props = {
    streamId: string
    streamPartition: Partition
    onMessage: (data: any, raw: any) => void
}

type MessagePresenceMap = {
    [index: string]: true
}

const EmptyMessagePresenceMap = {}

const MessageInterceptor = memo(
    ({ streamId, streamPartition, onMessage: onMessageProp }: Props) => {
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
                try {
                    sub = await streamrClient!.subscribe(
                        {
                            streamId,
                            partition: streamPartition,
                        },
                        async (data: any, raw: StreamMessage) => {
                            if (!mounted) {
                                return
                            }

                            if (messagesRef.current[data.id]) {
                                // Message with such id already exists. Suppress.
                                return
                            }

                            messagesRef.current[data.id] = true
                            if (data.type === MessageType.Text) {
                                data.roomId = streamId
                                await db.messages.add({
                                    roomId: streamId,
                                    serialized: JSON.stringify(data),
                                })
                            }

                            const { current: onMessage } = onMessageRef

                            if (typeof onMessage === 'function') {
                                onMessage(data, raw)
                            }
                        }
                    )
                } catch (e: any) {
                    console.warn(`Error subscribing to stream ${streamId}:`)
                }

                send(MetadataType.UserOnline, {
                    streamPartition: Partition.Metadata,
                    streamId,
                    data: account,
                })

                console.info(
                    'subscribed to stream',
                    streamId,
                    'on  partition',
                    streamPartition
                )

                if (!mounted) {
                    unsub()
                }
            }

            fn()

            return () => {
                mounted = false
                unsub()
            }
        }, [streamId, streamPartition, streamrClient, account, send])

        return null
    }
)

export default MessageInterceptor
