import { takeEvery } from 'redux-saga/effects'
import { MessageAction } from '..'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

function* onRegisterAction({
    payload: { message, owner },
}: ReturnType<typeof MessageAction.register>) {
    try {
        yield db.messages.add({
            ...message,
            owner: owner.toLowerCase(),
        })
    } catch (e) {
        handleError(e)
    }
}

export default function* register() {
    yield takeEvery(MessageAction.register, onRegisterAction)
}
