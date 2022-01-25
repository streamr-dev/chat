import { memo, useEffect, useRef } from 'react'
import { Partition } from '../../../utils/types'
import { useStore } from '../../Store'

type Props = {
    streamId: string
    streamPartition: Partition
    onMessage?: (data: any, raw: any) => void
}

type MessagePresenceMap = {
    [index: string]: true
}

const EmptyMessagePresenceMap = {}

const MessageInterceptor = memo(
    ({ streamId, streamPartition, onMessage: onMessageProp }: Props) => {
        const {
            session: { streamrClient },
        } = useStore()

        const messagesRef = useRef<MessagePresenceMap>(EmptyMessagePresenceMap)

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
                }
            }

            async function fn() {
                sub = await streamrClient!.subscribe(
                    {
                        streamId,
                        streamPartition,
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

                if (!mounted) {
                    unsub()
                }
            }

            fn()

            return () => {
                mounted = false
                unsub()
            }
        }, [streamId, streamPartition, streamrClient])

        return null
    }
)

export default MessageInterceptor
