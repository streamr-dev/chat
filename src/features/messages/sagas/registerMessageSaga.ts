import { call, takeEvery } from 'redux-saga/effects'
import { Address } from '../../../../types/common'
import db from '../../../utils/db'
import handleError from '../../../utils/handleError'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import { MessageAction, registerMessage } from '../actions'
import { MessageType } from '../types'

function* onRegisterMessageAction({
    payload: { type, message },
}: ReturnType<typeof registerMessage>) {
    try {
        const account: Address = yield call(getWalletAccountSaga)

        if (type === MessageType.Text) {
            yield db.messages.add({
                ...message,
                owner: account.toLowerCase(),
            })
            return
        }

        // @TODO handle metadata messages.
    } catch (e) {
        handleError(e)
    }
}

export default function* registerMessageSaga() {
    yield takeEvery(MessageAction.RegisterMessage, onRegisterMessageAction)
}
