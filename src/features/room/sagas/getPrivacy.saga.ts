import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '../../../../types/common'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getStream from '../../../utils/getStream'
import handleError from '../../../utils/handleError'
import { selectPrivacyGetting } from '../selectors'

function* onGetPrivacyAction({ payload: roomId }: ReturnType<typeof RoomAction.getPrivacy>) {
    const getting: boolean = yield select(selectPrivacyGetting(roomId))

    if (getting) {
        // Already in the process. Skipping.
        return
    }

    yield put(RoomAction.setGettingPrivacy({ roomId, state: true }))

    try {
        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | Stream = yield getStream(client, roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const canEveryoneSee: boolean = yield stream.hasPermission({
            public: true,
            permission: StreamPermission.SUBSCRIBE,
        })

        yield put(
            RoomAction.setLocalPrivacy({
                roomId,
                privacy: canEveryoneSee ? PrivacySetting.Public : PrivacySetting.Private,
            })
        )
    } catch (e) {
        handleError(e)
    }

    yield put(RoomAction.setGettingPrivacy({ roomId, state: false }))
}

export default function* getPrivacy() {
    yield takeEvery(RoomAction.getPrivacy, onGetPrivacyAction)
}
