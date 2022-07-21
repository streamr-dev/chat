import { MessageAction } from '$/features/message'
import { StreamMessage } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import handleError from '$/utils/handleError'
import { put, race, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { MessageStream } from 'streamr-client/types/src/subscribe/MessageStream'
import { TimeoutError } from 'streamr-client/types/src/utils'

async function timeout(after = 5000) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new TimeoutError())
        }, after)
    })
}

async function fetch(roomId: RoomId, streamrClient: StreamrClient) {
    const queue: MessageStream<StreamMessage> /* lol */ = await streamrClient.resend(roomId, {
        last: 20,
    })

    const messages = []

    for await (const raw of queue) {
        messages.push(raw)
    }

    return messages
}

function* onResendAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof MessageAction.resend>) {
    try {
        const owner = requester.toLowerCase()

        const { messages } = yield race({
            timeout: timeout(),
            messages: fetch(roomId, streamrClient),
        })

        for (let i = 0; i < messages.length; i++) {
            const raw = messages[i]

            const {
                messageId: { timestamp: createdAt },
            } = raw

            const { id, createdBy, content } = raw.getParsedContent()

            yield put(
                MessageAction.register({
                    owner,
                    message: {
                        createdAt,
                        createdBy,
                        content,
                        updatedAt: createdAt,
                        id,
                        roomId,
                    },
                })
            )
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* resend() {
    yield takeEvery(MessageAction.resend, onResendAction)
}
