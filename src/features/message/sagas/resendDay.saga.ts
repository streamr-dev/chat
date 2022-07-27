import { MessageAction } from '$/features/message'
import { StreamMessage } from '$/features/message/types'
import handleError from '$/utils/handleError'
import resendUtil from '$/utils/resend'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { put } from 'redux-saga/effects'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

function* onResendDayAction({
    payload: { roomId, requester, streamrClient, timestamp },
}: ReturnType<typeof MessageAction.resendDay>) {
    try {
        const owner = requester.toLowerCase()

        const messages: StreamrMessage<StreamMessage>[] = yield resendUtil(roomId, streamrClient, {
            timestamp,
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
    } catch (e: any) {
        if (e instanceof Error && /no storage assigned/i.test(e.message)) {
            return
        }

        handleError(e)
    }
}

export default function* resendDay() {
    yield takeEveryUnique(MessageAction.resendDay, onResendDayAction)
}
