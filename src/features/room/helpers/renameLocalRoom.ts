import { call } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import db from '$/utils/db'

export default function renameLocalRoom({
    roomId,
    name,
}: ReturnType<typeof RoomAction.renameLocal>['payload']) {
    return call(function* () {
        try {
            // Rename rooms for all record owners.
            yield db.rooms.where('id').equals(roomId).modify({ name })
        } catch (e) {
            handleError(e)
        }
    })
}
