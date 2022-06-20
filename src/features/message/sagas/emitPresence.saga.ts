import { put, throttle } from 'redux-saga/effects'
import Minute from '$/utils/minute'
import { MessageAction } from '..'
import { Instruction, MessageType } from '../types'

function* onEmitPresenceAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof MessageAction.emitPresence>) {
    yield put(
        MessageAction.publish({
            roomId,
            content: Instruction.UpdateSeenAt,
            type: MessageType.Instruction,
            requester,
            streamrClient,
        })
    )
}

export default function* emitPresence() {
    yield throttle(Minute / 2, MessageAction.emitPresence, onEmitPresenceAction)
}
