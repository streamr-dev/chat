import { ToastType } from '$/components/Toast'
import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import { ToasterAction } from '$/features/toaster'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import i18n from '$/utils/i18n'
import { call, put } from 'redux-saga/effects'

export default function unpinRoom({
    roomId,
    requester,
}: ReturnType<typeof RoomAction.unpin>['payload']) {
    return call(function* () {
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
    })
}
