import { call, put, takeEvery } from 'redux-saga/effects'
import { MessageAction } from '..'
import { Address } from '../../../../types/common'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import db from '../../../utils/db'
import handleError from '../../../utils/handleError'
import { MemberAction } from '../../member'
import { Instruction, MessageType } from '../types'

function* onRegisterAction({
    payload: { type, message },
}: ReturnType<typeof MessageAction.register>) {
    try {
        const account: Address = yield call(getWalletAccount)

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
                    MemberAction.notice({
                        address: message.createdBy,
                        timestamp: message.createdAt,
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

export default function* register() {
    yield takeEvery(MessageAction.register, onRegisterAction)
}
