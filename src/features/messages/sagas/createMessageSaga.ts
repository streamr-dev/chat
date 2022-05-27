import { takeEvery } from 'redux-saga/effects'
import db from '../../../utils/db'
import { createMessage, MessageAction } from '../actions'

function* onCreateMessageAction({ payload }: ReturnType<typeof createMessage>) {
    try {
        yield db.messages.add(payload)
    } catch (e) {
        console.warn('Oh no, this again?', e)
    }
}

export default function* createMessageSaga() {
    yield takeEvery(MessageAction.CreateMessage, onCreateMessageAction)
}
