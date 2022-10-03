import { StreamMessage } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import handleError from '$/utils/handleError'
import StreamrClient, { Subscription } from 'streamr-client'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

type Message = StreamrMessage<StreamMessage>

function isMessage(e: any): e is Message {
    return !!e
}

export default function subscribe(roomId: RoomId, streamrClient: StreamrClient) {
    let sub: undefined | Subscription<StreamMessage>

    let cancelled = false

    function unsub() {
        if (sub) {
            streamrClient.unsubscribe(sub)
            sub = undefined
        }
    }

    const rs = new ReadableStream<Message>({
        async start(controller: ReadableStreamDefaultController<Message>) {
            try {
                sub = await streamrClient.subscribe(
                    {
                        streamId: roomId,
                    },
                    (_, raw) => {
                        controller.enqueue(raw)
                    }
                )

                if (cancelled) {
                    return void unsub()
                }

                sub.onError((e: any) => {
                    const raw = e.streamMessage

                    if (!isMessage(raw)) {
                        return
                    }

                    controller.enqueue(raw)
                })
            } catch (e) {
                handleError(e)
            }
        },
        cancel() {
            unsub()
            cancelled = true
        },
    })

    const reader = rs.getReader()

    return {
        async next() {
            return reader.read()
        },
        async abort() {
            await reader.cancel()
        },
    }
}
