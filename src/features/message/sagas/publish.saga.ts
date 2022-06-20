import { takeEvery } from 'redux-saga/effects'
import handleError from '$/utils/handleError'
import { v4 as uuidv4 } from 'uuid'
import { MessageAction } from '..'

function* onPublishAction({
    payload: { roomId, content, type, requester: createdBy, streamrClient },
}: ReturnType<typeof MessageAction.publish>) {
    try {
        yield streamrClient.publish(roomId, {
            id: uuidv4(),
            content,
            createdBy,
            type,
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* publish() {
    yield takeEvery(MessageAction.publish, onPublishAction)
}
