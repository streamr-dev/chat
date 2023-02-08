import { put } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { isTokenGatedRoom } from '$/features/tokenGatedRooms/utils/isTokenGatedRoom'

function* onGetPrivacyAction({
    payload: { roomId, streamrClient },
}: ReturnType<typeof RoomAction.getPrivacy>) {
    try {
        const stream: undefined | Stream = yield streamrClient.getStream(roomId)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const isTokenGated: boolean = isTokenGatedRoom(stream)

        const canEveryoneSee: boolean = yield stream.hasPermission({
            public: true,
            permission: StreamPermission.SUBSCRIBE,
        })

        const privacy = isTokenGated
            ? PrivacySetting.TokenGated
            : canEveryoneSee
            ? PrivacySetting.Public
            : PrivacySetting.Private

        yield put(
            RoomAction.setLocalPrivacy({
                roomId,
                privacy,
            })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* getPrivacy() {
    yield takeEveryUnique(RoomAction.getPrivacy, onGetPrivacyAction)
}
