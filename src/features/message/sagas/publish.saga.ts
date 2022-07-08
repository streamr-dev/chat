import { takeEvery } from 'redux-saga/effects'
import handleError from '$/utils/handleError'
import { v4 as uuidv4 } from 'uuid'
import { MessageAction } from '..'

function* onPublishAction({
    payload: { roomId, content, requester: createdBy, streamrClient },
}: ReturnType<typeof MessageAction.publish>) {
    try {
        yield streamrClient.publish(roomId, {
            id: uuidv4(),
            content,
            createdBy,
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* publish() {
    yield takeEvery(MessageAction.publish, onPublishAction)
}
