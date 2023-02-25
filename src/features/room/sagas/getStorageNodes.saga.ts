import { put } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import { RoomAction } from '..'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import fetchStream from '$/utils/fetchStream'

function* onGetStorageNodesAction({
    payload: { roomId, streamrClient },
}: ReturnType<typeof RoomAction.getStorageNodes>) {
    try {
        const stream: Stream | null = yield fetchStream(roomId, streamrClient)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const storageNodes: string[] = yield stream.getStorageNodes()

        yield put(
            RoomAction.setLocalStorageNodes({
                roomId,
                addresses: storageNodes,
            })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* getStorageNodes() {
    yield takeEveryUnique(RoomAction.getStorageNodes, onGetStorageNodesAction)
}
