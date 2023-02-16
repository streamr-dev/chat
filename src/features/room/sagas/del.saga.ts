import { put } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import takeEveryUnique from '$/utils/takeEveryUnique'
import toast from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'

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

        yield toast({
            title: 'Room has been deleted',
            type: ToastType.Success,
        })
    } catch (e) {
        handleError(e)

        yield toast({
            title: 'Failed to delete room',
            type: ToastType.Error,
        })
    }
}

export default function* del() {
    yield takeEveryUnique(RoomAction.delete, onDeleteAction)
}
