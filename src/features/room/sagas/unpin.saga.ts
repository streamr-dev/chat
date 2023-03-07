import { ToastType } from '$/components/Toast'
import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import toast from '$/features/toaster/helpers/toast'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/I18n'
import takeEveryUnique from '$/utils/takeEveryUnique'
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

        yield toast({
            title: i18n('unpinToast.failureTitle'),
            type: ToastType.Error,
        })
    }
}

export default function* unpin() {
    yield takeEveryUnique(RoomAction.unpin, onUnpinAction)
}
