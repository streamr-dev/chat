import { ToastType } from '$/components/Toast'
import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import { ToasterAction } from '$/features/toaster'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { put } from 'redux-saga/effects'

function* onUnpinAction({ payload: { roomId, requester } }: ReturnType<typeof RoomAction.unpin>) {
    try {
        yield db.rooms
            .where({ owner: requester.toLowerCase(), id: roomId })
            .modify({ pinned: false })

        yield put(
            RoomAction.sync({
                roomId,
                requester,
                fingerprint: Flag.isSyncingRoom(roomId),
            })
        )
    } catch (e) {
        handleError(e)

        yield put(
            ToasterAction.show({
                title: i18n('unpinToast.failureTitle'),
                type: ToastType.Error,
            })
        )
    }
}

export default function* unpin() {
    yield takeEveryUnique(RoomAction.unpin, onUnpinAction)
}
