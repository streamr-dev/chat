import { takeEvery } from 'redux-saga/effects'
import { MessageAction } from '..'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

function* onRegisterAction({
    payload: { message, owner: acc },
}: ReturnType<typeof MessageAction.register>) {
    const owner = acc.toLowerCase()

    try {
        yield db.messages.add({
            ...message,
            owner,
        })

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
}

export default function* register() {
    yield takeEvery(MessageAction.register, onRegisterAction)
}
