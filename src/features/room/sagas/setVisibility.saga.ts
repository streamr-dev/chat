import { RoomAction } from '$/features/room'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { error } from '$/utils/toaster'
import { takeEvery } from 'redux-saga/effects'

function* onSetVisibilityAction({
    payload: { roomId, owner, visible },
}: ReturnType<typeof RoomAction.setVisibility>) {
    try {
        yield db.rooms
            .where({ id: roomId, owner: owner.toLowerCase() })
            .modify({ hidden: !visible })
    } catch (e) {
        handleError(e)

        error('Failed to toggle room visibility.')
    }
}

export default function* setVisibility() {
    yield takeEvery(RoomAction.setVisibility, onSetVisibilityAction)
}
