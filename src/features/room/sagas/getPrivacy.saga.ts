import { put } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import getRoomMetadata from '$/utils/getRoomMetadata'
import fetchStream from '$/utils/fetchStream'

function* onGetPrivacyAction({
    payload: { roomId, streamrClient },
}: ReturnType<typeof RoomAction.getPrivacy>) {
    try {
        const stream: Stream | null = yield fetchStream(roomId, streamrClient)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const isTokenGated = !!getRoomMetadata(stream).tokenAddress

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
