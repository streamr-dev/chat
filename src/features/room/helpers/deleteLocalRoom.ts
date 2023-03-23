import { call } from 'redux-saga/effects'
import { RoomAction } from '..'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

export default function deleteLocalRoom({
    roomId,
    requester,
}: ReturnType<typeof RoomAction.deleteLocal>['payload']) {
    return call(function* () {
        try {
            const owner = requester.toLowerCase()

            // Delete room messages for a given record owner.
            yield db.messages.where({ owner, roomId }).delete()

            // Delete room for a given record owner.
            yield db.rooms.where({ owner, id: roomId }).delete()
        } catch (e) {
            handleError(e)
        }
    })
}
