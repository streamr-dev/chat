import { MessageAction } from '$/features/message'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { call } from 'redux-saga/effects'

export default function updateMessageSeenAt({
    id,
    roomId,
    requester,
    seenAt,
}: ReturnType<typeof MessageAction.updateSeenAt>['payload']) {
    return call(function* () {
        try {
            yield db.messages
                .where({
                    owner: requester.toLowerCase(),
                    roomId,
                    id,
                })
                .modify({
                    seenAt,
                })
        } catch (e) {
            handleError(e)
        }
    })
}
