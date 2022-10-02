import { StreamMessage } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import getBeginningOfDay, { DayInMillis } from '$/utils/getBeginningOfDay'
import StreamrClient from 'streamr-client'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'
import { MessageStream } from 'streamr-client/types/src/subscribe/MessageStream'

interface Options {
    timestamp?: number
    exact?: boolean
}

type Message = StreamrMessage<StreamMessage>

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

export default function resend(
    roomId: RoomId,
    streamrClient: StreamrClient,
    { timestamp, exact = false }: Options = {}
) {
    const rs = new ReadableStream<Message>({
        async start(controller: ReadableStreamDefaultController<Message>) {
            const queue: MessageStream<StreamMessage> /* lol */ = await streamrClient.resend(
                roomId,
                formatFilter(timestamp, exact)
            )

            function isMessage(e: any): e is Message {
                return !!e
            }

            queue.onError((e: any) => {
                const msg = e.streamMessage

                if (!isMessage(msg)) {
                    return
                }

                controller.enqueue(msg)

                queue.end()
            })

            for await (const raw of queue) {
                controller.enqueue(raw)
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
