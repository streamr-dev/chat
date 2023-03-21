import { MessageAction } from '$/features/message'
import handleError from '$/utils/handleError'
import { call } from 'redux-saga/effects'

export default function publishMessage({
    roomId,
    content,
    streamrClient,
}: ReturnType<typeof MessageAction.publish>['payload']) {
    return call(function* () {
        try {
            yield streamrClient.publish(roomId, {
                content,
            })
        } catch (e) {
            handleError(e)
        }
    })
}
