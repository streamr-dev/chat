import { StreamMessage } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import getBeginningOfDay, { DayInMillis } from '$/utils/getBeginningOfDay'
import StreamrClient from 'streamr-client'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'
import { MessageStream } from 'streamr-client/types/src/subscribe/MessageStream'

interface Options {
    timestamp?: number
}

type Message = StreamrMessage<StreamMessage>

export default function resend(
    roomId: RoomId,
    streamrClient: StreamrClient,
    { timestamp }: Options = {}
) {
    const filter =
        typeof timestamp === 'number'
            ? {
                  from: {
                      timestamp: getBeginningOfDay(timestamp),
                  },
                  to: {
                      timestamp: getBeginningOfDay(timestamp) + DayInMillis - 1,
                  },
              }
            : { last: 20 }

    const rs = new ReadableStream<Message>({
        async start(controller: ReadableStreamDefaultController<Message>) {
            const queue: MessageStream<StreamMessage> /* lol */ = await streamrClient.resend(
                roomId,
                filter
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
