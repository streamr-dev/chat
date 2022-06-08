import { Provider } from '@web3-react/types'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { RoomAction } from '..'
import { Address } from '../../../../types/common'
import getWalletAccount from '../../../sagas/getWalletAccount.saga'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getWalletProvider from '../../../sagas/getWalletProvider.saga'
import handleError from '../../../utils/handleError'
import preflight from '../../../utils/preflight'
import { error, success } from '../../../utils/toaster'
import { selectGettingStorageNodes, selectStorageNodeToggling } from '../selectors'

function* onToggleStorageNodeAction({
    payload: { roomId, address, state },
}: ReturnType<typeof RoomAction.toggleStorageNode>) {
    let dirty = false

    try {
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

        const provider: Provider = yield call(getWalletProvider)

        const account: Address = yield call(getWalletAccount)

        yield preflight({
            provider,
            address: account,
        })

        yield put(
            RoomAction.setTogglingStorageNode({
                roomId,
                address,
                state: true,
            })
        )

        dirty = true

        let succeeded = false

        const client: StreamrClient = yield call(getWalletClient)

        try {
            if (state) {
                yield client.addStreamToStorageNode(roomId, address)
            } else {
                yield client.removeStreamFromStorageNode(roomId, address)
            }

            succeeded = true
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
    } finally {
        if (dirty) {
            yield put(
                RoomAction.setTogglingStorageNode({
                    roomId,
                    address,
                    state: false,
                })
            )
        }
    }
}

export default function* toggleStorageNode() {
    yield takeEvery(RoomAction.toggleStorageNode, onToggleStorageNodeAction)
}
