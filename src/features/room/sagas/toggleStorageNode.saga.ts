import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { RoomAction } from '..'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import handleError from '../../../utils/handleError'
import { error, success } from '../../../utils/toaster'
import { selectGettingStorageNodes, selectStorageNodeToggling } from '../selectors'

function* onToggleStorageNodeAction({
    payload: { roomId, address, state },
}: ReturnType<typeof RoomAction.toggleStorageNode>) {
    const toggling: boolean = yield select(selectStorageNodeToggling(roomId, address))

    if (toggling) {
        // Doing it already. Skipping.
        return
    }

    const getting: boolean = yield select(selectGettingStorageNodes(roomId))

    if (getting) {
        // We're getting the nodes. Let's wait and see what's up. Skipping.
        return
    }

    yield put(
        RoomAction.setTogglingStorageNode({
            roomId,
            address,
            state: true,
        })
    )

    const succeeded = false

    try {
        const client: StreamrClient = yield call(getWalletClient)

        try {
            if (state) {
                yield client.addStreamToStorageNode(roomId, address)
            } else {
                yield client.removeStreamFromStorageNode(roomId, address)
            }
        } catch (e) {
            console.warn(e)
        }

        if (succeeded) {
            state ? success(`Storage enabled.`) : success(`Storage disabled.`)

            yield put(
                RoomAction.setLocalStorageNode({
                    roomId,
                    address,
                    state,
                })
            )

            return
        }

        state ? error(`Failed to enable storage.`) : error(`Failed to disable storage.`)
    } catch (e) {
        handleError(e)
    }

    yield put(
        RoomAction.setTogglingStorageNode({
            roomId,
            address,
            state: false,
        })
    )
}

export default function* toggleStorageNode() {
    yield takeEvery(RoomAction.toggleStorageNode, onToggleStorageNodeAction)
}
