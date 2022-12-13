import { StreamMessage as ChatMessage } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import getBeginningOfDay, { DayInMillis } from '$/utils/getBeginningOfDay'
import StreamrClient from 'streamr-client'
import { StreamMessage } from 'streamr-client-protocol'

interface Options {
    timestamp?: number
    exact?: boolean
}

function formatFilter(timestamp: undefined | number, exact: boolean) {
    if (typeof timestamp === 'undefined') {
        return {
            last: 20,
        }
    }

    if (exact) {
        return {
            from: {
                timestamp,
            },
            to: {
                timestamp,
            },
        }
    }

    return {
        from: {
            timestamp: getBeginningOfDay(timestamp),
        },
        to: {
            timestamp: getBeginningOfDay(timestamp) + DayInMillis - 1,
        },
    }
}

function is<T>(arg: unknown): arg is T {
    return !!arg
}

export default function resend<T = StreamMessage<ChatMessage>>(
    roomId: RoomId,
    streamrClient: StreamrClient,
    { timestamp, exact = false }: Options = {}
) {
    const rs = new ReadableStream<T>({
        async start(controller: ReadableStreamDefaultController<T>) {
            const queue = await streamrClient.resend<T>(roomId, formatFilter(timestamp, exact))

            // @ts-expect-error `onError` is internal.
            queue.onError.listen((e: any) => {
                const msg = e.streamMessage

                if (!is<T>(msg)) {
                    return
                }

                controller.enqueue(msg)
            })

            for await (const raw of queue) {
                controller.enqueue(raw as T)
            }

            controller.close()
        },
    })

    const reader = rs.getReader()

    return {
        async next() {
            return reader.read()
        },
    }
}
