import { takeEvery } from 'redux-saga/effects'
import db from '../../../utils/db'
import handleError from '../../../utils/handleError'
import { MessageAction, registerMessage } from '../actions'

function* onRegisterMessageAction({ payload }: ReturnType<typeof registerMessage>) {
    try {
        yield db.messages.add(payload)
    } catch (e) {
        handleError(e)
    }
}

export default function* registerMessageSaga() {
    yield takeEvery(MessageAction.RegisterMessage, onRegisterMessageAction)
}
