import { call } from 'redux-saga/effects'
import { MessageAction } from '..'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { IMessage } from '$/features/message/types'

export default function registerMessage({
    message,
    owner: acc,
}: ReturnType<typeof MessageAction.register>['payload']) {
    return call(function* () {
        const owner = acc.toLowerCase()

        try {
            let msg: undefined | IMessage = undefined

            try {
                msg = yield db.messages
                    .where({
                        id: message.id,
                        owner,
                    })
                    .first()
            } catch (e) {
                // Nothing.
            }

            if (!msg) {
                yield db.messages.add({
                    ...message,
                    owner,
                })
            } else if (typeof msg.content === 'undefined') {
                yield db.messages
                    .where({
                        id: message.id,
                        owner,
                    })
                    .modify({ content: message.content })
            }

            const { createdAt: recentMessageAt } = message

            if (typeof recentMessageAt === 'number') {
                try {
                    yield db.rooms
                        .where({ owner, id: message.roomId })
                        .and(
                            (r) =>
                                typeof r.recentMessageAt !== 'number' ||
                                r.recentMessageAt < recentMessageAt
                        )
                        .modify({ recentMessageAt })
                } catch (e) {
                    handleError(e)
                }
            }
        } catch (e) {
            handleError(e)
        }
    })
}
