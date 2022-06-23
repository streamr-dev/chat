import { put } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onDeleteAction({
    payload: { roomId, provider, requester, streamrClient },
}: ReturnType<typeof RoomAction.delete>) {
    try {
        yield preflight({
            provider,
            requester,
        })

        yield streamrClient.deleteStream(roomId)

        yield put(RoomAction.deleteLocal({ roomId, requester }))

        success('Room has been deleted.')
    } catch (e) {
        handleError(e)

        error('Failed to delete room.')
    }
}

export default function* del() {
    yield takeEveryUnique(RoomAction.delete, onDeleteAction)
}
