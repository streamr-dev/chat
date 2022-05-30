import { call, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import getDelegatedClientSaga from '../../../sagas/getDelegatedClientSaga'
import handleError from '../../../utils/handleError'
import { publishMessage, MessageAction } from '../actions'

function* onPublishMessageAction({ payload }: ReturnType<typeof publishMessage>) {
    try {
        const client: StreamrClient = yield call(getDelegatedClientSaga)

        console.log('Client', client)
        console.log('Payload', payload)
    } catch (e) {
        handleError(e)
    }
}

export default function* publishMessageSaga() {
    yield takeEvery(MessageAction.PublishMessage, onPublishMessageAction)
}
