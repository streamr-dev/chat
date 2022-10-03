import { takeEvery } from 'redux-saga/effects'
import handleError from '$/utils/handleError'
import { MessageAction } from '..'

function* onPublishAction({
    payload: { roomId, content, streamrClient },
}: ReturnType<typeof MessageAction.publish>) {
    try {
        yield streamrClient.publish(roomId, {
            content,
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* publish() {
    yield takeEvery(MessageAction.publish, onPublishAction)
}
