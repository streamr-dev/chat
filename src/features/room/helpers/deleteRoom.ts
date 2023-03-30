import { call, put } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { ToastType } from '$/components/Toast'
import i18n from '$/utils/i18n'
import StreamrClient from 'streamr-client'
import getTransactionalClient from '$/utils/getTransactionalClient'
import { MiscAction } from '$/features/misc'

export default function deleteRoom({
    roomId,
    requester,
}: ReturnType<typeof RoomAction.delete>['payload']) {
    return call(function* () {
        try {
            yield preflight(requester)

            const streamrClient: StreamrClient = yield getTransactionalClient()

            yield streamrClient.deleteStream(roomId)

            yield put(RoomAction.deleteLocal({ roomId, requester }))

            yield put(
                MiscAction.toast({
                    title: i18n('deleteRoomToast.successTitle'),
                    type: ToastType.Success,
                })
            )
        } catch (e) {
            handleError(e)

            yield put(
                MiscAction.toast({
                    title: i18n('deleteRoomToast.failureTitle'),
                    type: ToastType.Error,
                })
            )
        }
    })
}
