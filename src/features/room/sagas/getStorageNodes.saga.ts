import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient, { Stream } from 'streamr-client'
import { RoomAction } from '..'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getStream from '../../../utils/getStream'
import handleError from '../../../utils/handleError'
import { selectGettingStorageNodes } from '../selectors'

function* onGetStorageNodesAction({
    payload: roomId,
}: ReturnType<typeof RoomAction.getStorageNodes>) {
    const getting: boolean = yield select(selectGettingStorageNodes(roomId))

    if (getting) {
        // Already in the middle of getting the nodes. Skipping.
        return
    }

    yield put(
        RoomAction.setGettingStorageNodes({
            roomId,
            state: true,
        })
    )

    try {
        const client: StreamrClient = yield call(getWalletClient)

        const stream: Stream = yield getStream(client, roomId)

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

    yield put(
        RoomAction.setGettingStorageNodes({
            roomId,
            state: false,
        })
    )
}

export default function* getStorageNodes() {
    yield takeEvery(RoomAction.getStorageNodes, onGetStorageNodesAction)
}
