import { put, throttle } from 'redux-saga/effects'
import Minute from '../../../utils/minute'
import { MessageAction } from '..'
import { Instruction, MessageType } from '../types'

export default function* emitPresence() {
    yield throttle(
        Minute / 2,
        MessageAction.emitPresence,
        function* ({ payload: roomId }: ReturnType<typeof MessageAction.emitPresence>) {
            yield put(
                MessageAction.publish({
                    roomId,
                    content: Instruction.UpdateSeenAt,
                    type: MessageType.Instruction,
                })
            )
        }
    )
}
