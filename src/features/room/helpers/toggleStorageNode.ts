import { call, put } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { ToastType } from '$/components/Toast'
import i18n from '$/utils/i18n'
import StreamrClient from '@streamr/sdk'
import getTransactionalClient from '$/utils/getTransactionalClient'
import { MiscAction } from '$/features/misc'

export default function toggleStorageNode({
    roomId,
    address,
    state,
    requester,
}: ReturnType<typeof RoomAction.toggleStorageNode>['payload']) {
    return call(function* () {
        try {
            yield preflight(requester)

            const streamrClient: StreamrClient = yield getTransactionalClient()

            yield put(
                RoomAction.setTogglingStorageNode({
                    roomId,
                    address,
                    state: true,
                })
            )

            if (state) {
                yield streamrClient.addStreamToStorageNode(roomId, address)

                yield put(
                    MiscAction.toast({
                        title: i18n('storageToast.enabledTitle'),
                        type: ToastType.Success,
                    })
                )
            } else {
                yield streamrClient.removeStreamFromStorageNode(roomId, address)

                yield put(
                    MiscAction.toast({
                        title: i18n('storageToast.disabledTitle'),
                        type: ToastType.Success,
                    })
                )
            }

            yield put(
                RoomAction.setLocalStorageNode({
                    roomId,
                    address,
                    state,
                })
            )
        } catch (e) {
            handleError(e)

            yield put(
                MiscAction.toast({
                    title: state
                        ? i18n('storageToast.failedToEnableTitle')
                        : i18n('storageToast.failedToDisableTitle'),
                    type: ToastType.Error,
                })
            )
        }
    })
}
