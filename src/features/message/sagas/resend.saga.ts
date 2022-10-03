import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import { IResend, StreamMessage } from '$/features/message/types'
import db from '$/utils/db'
import getBeginningOfDay, { DayInMillis, TimezoneOffset } from '$/utils/getBeginningOfDay'
import handleError from '$/utils/handleError'
import resendUtil from '$/utils/resend'
import takeEveryUnique from '$/utils/takeEveryUnique'
import toLocalMessage from '$/utils/toLocalMessage'
import { put } from 'redux-saga/effects'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

function* onResendAction({
    payload: { roomId, requester, streamrClient, timestamp, exact = false },
}: ReturnType<typeof MessageAction.resend>) {
    try {
        const owner = requester.toLowerCase()

        if (typeof timestamp !== 'undefined' && !exact) {
            const bod = getBeginningOfDay(timestamp)

            // Mark timestamp's beginning of day as the moment from which we display messages.
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
                // If a resend for a particular beginning of day exists (w/ proper timezone offset)
                // we skip the actual fetching. We can assume the messages were stored locally along
                // with the resend record. See below for details on the logic.
                return
            }
        }

        const queue = resendUtil(roomId, streamrClient, {
            timestamp,
            exact,
        })

        let minCreatedAt: undefined | number = undefined

        while (true) {
            const { value, done }: ReadableStreamReadResult<StreamrMessage<StreamMessage>> =
                yield queue.next()

            if (value) {
                const message = toLocalMessage(value)

                const { createdAt } = message

                yield put(
                    MessageAction.register({
                        owner,
                        message,
                    })
                )

                if (typeof createdAt === 'number') {
                    yield put(
                        MessageAction.setFromTimestamp({
                            roomId,
                            requester,
                            timestamp: createdAt,
                        })
                    )

                    if (typeof minCreatedAt === 'undefined' || minCreatedAt > createdAt) {
                        minCreatedAt = createdAt
                    }
                }
            }

            if (done) {
                break
            }
        }

        if (exact) {
            return
        }

        if (typeof timestamp !== 'undefined') {
            const eod = getBeginningOfDay(timestamp) + DayInMillis - 1

            const currentBod = getBeginningOfDay(Date.now())

            // We only record a `resend` when its day is over. We always resend "today".
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
