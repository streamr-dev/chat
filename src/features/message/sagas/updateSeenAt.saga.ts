import { MessageAction } from '$/features/message'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'

async function onUpdateSeenAtAction({
    payload: { id, roomId, requester, seenAt },
}: ReturnType<typeof MessageAction.updateSeenAt>) {
    try {
        await db.messages
            .where({
                owner: requester.toLowerCase(),
                roomId,
                id,
            })
            .modify({
                seenAt,
            })
    } catch (e) {
        handleError(e)
    }
}

export default function* updateSeenAt() {
    yield takeEveryUnique(MessageAction.updateSeenAt, onUpdateSeenAtAction)
}
