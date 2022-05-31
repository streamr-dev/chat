import { call, put, takeEvery } from 'redux-saga/effects'
import { Address } from '../../../../types/common'
import db from '../../../utils/db'
import handleError from '../../../utils/handleError'
import { setLastSeenAt } from '../../members/actions'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import { MessageAction, registerMessage } from '../actions'
import { Instruction, MessageType } from '../types'

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

        if (type !== MessageType.Instruction) {
            return
        }

        switch (message.content) {
            case Instruction.UpdateSeenAt:
                if (typeof message.createdAt !== 'number' || !message.createdBy) {
                    break
                }

                yield put(
                    setLastSeenAt({
                        address: message.createdBy,
                        value: message.createdAt,
                    })
                )

                break
            default:
                // Unknown instruction.
                break
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* registerMessageSaga() {
    yield takeEvery(MessageAction.RegisterMessage, onRegisterMessageAction)
}
