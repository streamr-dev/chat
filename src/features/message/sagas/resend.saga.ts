import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import { StreamMessage } from '$/features/message/types'
import handleError from '$/utils/handleError'
import resendUtil from '$/utils/resend'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { put } from 'redux-saga/effects'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

function* onResendAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof MessageAction.resend>) {
    try {
        const owner = requester.toLowerCase()

        const messages: StreamrMessage<StreamMessage>[] = yield resendUtil(roomId, streamrClient)

        let minCreatedAt: undefined | number = undefined

        for (let i = 0; i < messages.length; i++) {
            const raw = messages[i]

            const {
                messageId: { timestamp: createdAt },
            } = raw

            if (typeof createdAt === 'number') {
                if (typeof minCreatedAt === 'undefined' || minCreatedAt > createdAt) {
                    minCreatedAt = createdAt
                }
            }

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

        if (typeof minCreatedAt !== 'undefined') {
            yield put(
                MessageAction.resendDay({
                    roomId,
                    requester,
                    streamrClient,
                    timestamp: minCreatedAt,
                    fingerprint: Flag.isResendingMessagesForSpecificDay(
                        roomId,
                        requester,
                        minCreatedAt
                    ),
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

export default function* resend() {
    yield takeEveryUnique(MessageAction.resend, onResendAction)
}
