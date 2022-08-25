import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import { IResend, StreamMessage } from '$/features/message/types'
import db from '$/utils/db'
import getBeginningOfDay, { DayInMillis, TimezoneOffset } from '$/utils/getBeginningOfDay'
import handleError from '$/utils/handleError'
import resendUtil from '$/utils/resend'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { put } from 'redux-saga/effects'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

function* onResendAction({
    payload: { roomId, requester, streamrClient, timestamp },
}: ReturnType<typeof MessageAction.resend>) {
    try {
        const owner = requester.toLowerCase()

        if (typeof timestamp !== 'undefined') {
            const bod = getBeginningOfDay(timestamp)

            yield put(MessageAction.setFromTimestamp({ roomId, requester, timestamp: bod }))

            let dayAlreadyResent = false

            try {
                const resend: null | IResend = yield db.resends
                    .where({
                        owner,
                        roomId,
                        timezoneOffset: TimezoneOffset,
                        beginningOfDay: bod,
                    })
                    .first()

                dayAlreadyResent = !!resend
            } catch (e) {
                // Ignore.
            }

            if (dayAlreadyResent) {
                return
            }
        }

        const messages: StreamrMessage<StreamMessage>[] = yield resendUtil(roomId, streamrClient, {
            timestamp,
        })

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

        if (typeof timestamp !== 'undefined') {
            const eod = getBeginningOfDay(timestamp) + DayInMillis - 1

            const currentBod = getBeginningOfDay(Date.now())

            if (eod < currentBod) {
                try {
                    yield db.resends.add({
                        owner: requester.toLowerCase(),
                        roomId,
                        beginningOfDay: getBeginningOfDay(timestamp),
                        timezoneOffset: TimezoneOffset,
                    })
                } catch (e) {
                    handleError(e)
                }
            }

            return
        }

        // This happens only to `resend` calls without timestamp (the initial one).
        if (typeof minCreatedAt !== 'undefined') {
            yield put(
                MessageAction.resend({
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
