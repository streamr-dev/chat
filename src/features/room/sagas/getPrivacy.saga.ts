import { put } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onGetPrivacyAction({
    payload: { roomId, streamrClient },
}: ReturnType<typeof RoomAction.getPrivacy>) {
    try {
        const stream: undefined | Stream = yield getStream(streamrClient, roomId)

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
}

export default function* getPrivacy() {
    yield takeEveryUnique(RoomAction.getPrivacy, onGetPrivacyAction)
}
