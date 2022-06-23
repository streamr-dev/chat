import { put } from 'redux-saga/effects'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'

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

            success('Storage enabled.')
        } else {
            yield streamrClient.removeStreamFromStorageNode(roomId, address)

            success('Storage disabled.')
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

        if (state) {
            error('Failed to enable storage.')
        } else {
            error('Failed to disable storage.')
        }
    }
}

export default function* toggleStorageNode() {
    yield takeEveryUnique(RoomAction.toggleStorageNode, onToggleStorageNodeAction)
}
