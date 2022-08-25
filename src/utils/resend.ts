import TimeoutError from '$/errors/TimeoutError'
import { StreamMessage } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import getBeginningOfDay, { DayInMillis } from '$/utils/getBeginningOfDay'
import StreamrClient from 'streamr-client'
import { MessageStream } from 'streamr-client/types/src/subscribe/MessageStream'

interface FetchOptions {
    timestamp?: number
}

async function fetch(
    roomId: RoomId,
    streamrClient: StreamrClient,
    { timestamp }: FetchOptions = {}
) {
    const scope =
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

    const queue: MessageStream<StreamMessage> /* lol */ = await streamrClient.resend(roomId, scope)

    const messages = []

    for await (const raw of queue) {
        messages.push(raw)
    }

    return messages
}

interface Options extends FetchOptions {
    timeoutAfter?: number
}

export default async function resend(
    roomId: RoomId,
    streamrClient: StreamrClient,
    { timeoutAfter = 10000, timestamp }: Options = {}
) {
    const messages = await Promise.race([
        fetch(roomId, streamrClient, {
            timestamp,
        }),
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new TimeoutError())
            }, timeoutAfter)
        }),
    ])

    return messages
}
