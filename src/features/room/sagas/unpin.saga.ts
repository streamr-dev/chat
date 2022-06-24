import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error } from '$/utils/toaster'
import { put } from 'redux-saga/effects'

function* onUnpinAction({
    payload: { roomId, requester, streamrClient },
}: ReturnType<typeof RoomAction.unpin>) {
    try {
        yield db.rooms
            .where({ owner: requester.toLowerCase(), id: roomId })
            .modify({ pinned: false })

        yield put(
            RoomAction.sync({
                roomId,
                requester,
                streamrClient,
                fingerprint: Flag.isSyncingRoom(roomId),
            })
        )
    } catch (e) {
        handleError(e)

        error('Unpinning failed.')
    }
}

export default function* unpin() {
    yield takeEveryUnique(RoomAction.unpin, onUnpinAction)
}
