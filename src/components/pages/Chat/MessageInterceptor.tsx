import { memo, useEffect, useRef } from 'react'
import { MessageType, Partition } from '../../../utils/types'
import { useStore } from '../../Store'
import { v4 as uuidv4 } from 'uuid'
import { useSend } from './MessageTransmitter'
import { MetadataType } from './MessageAggregator'

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
                sub = await streamrClient!.subscribe(
                    {
                        streamId,
                        partition: streamPartition,
                    },
                    (data: any, raw: any) => {
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
                    /*
                await streamrClient!.publish(
                    streamId,
                    {
                        id: uuidv4(),
                        type: 'user-online',
                        from: account,
                        timestamp: Date.now(),
                    },
                    Date.now(),
                    MessageType.Metadata
                )*/

                send(MetadataType.UserOnline, { streamPartition: Partition.Metadata})

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
