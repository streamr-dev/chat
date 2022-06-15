import { RoomAction } from '$/features/room'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { takeEvery } from 'redux-saga/effects'

export default function* setVisibility() {
    yield takeEvery(RoomAction.setVisibility, function* ({ payload: { roomId, owner, visible } }) {
        try {
            const numUpdated: number = yield db.rooms
                .where({ id: roomId, owner: owner.toLowerCase() })
                .modify({ hidden: !visible })

            if (numUpdated === 0) {
                return
            }
        } catch (e) {
            handleError(e)

            error('Failed to toggle room visibility.')
        }
    })
}
