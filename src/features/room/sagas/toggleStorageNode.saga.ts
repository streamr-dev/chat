import { put } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import takeEveryUnique from '$/utils/takeEveryUnique'
import toast from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'

function* onToggleStorageNodeAction({
    payload: { roomId, address, state, provider, requester, streamrClient },
}: ReturnType<typeof RoomAction.toggleStorageNode>) {
    try {
        yield preflight({
            provider,
            requester,
        })

        yield put(
            RoomAction.setTogglingStorageNode({
                roomId,
                address,
                state: true,
            })
        )

        if (state) {
            yield streamrClient.addStreamToStorageNode(roomId, address)

            yield toast({
                title: 'Storage enabled',
                type: ToastType.Success,
            })
        } else {
            yield streamrClient.removeStreamFromStorageNode(roomId, address)

            yield toast({
                title: 'Storage disabled',
                type: ToastType.Success,
            })
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

        yield toast({
            title: state ? 'Failed to enable storage' : 'Failed to disable storage',
            type: ToastType.Error,
        })
    }
}

export default function* toggleStorageNode() {
    yield takeEveryUnique(RoomAction.toggleStorageNode, onToggleStorageNodeAction)
}
