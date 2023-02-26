import { put, select } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import fetchStream from '$/utils/fetchStream'
import { selectPrivacy } from '$/hooks/usePrivacy'
import fetchPrivacy from '$/utils/fetchPrivacy'

function* onGetPrivacyAction({
    payload: { roomId, streamrClient },
}: ReturnType<typeof RoomAction.getPrivacy>) {
    try {
        const currentPrivacy: PrivacySetting | undefined = yield select(selectPrivacy(roomId))

        if (currentPrivacy) {
            return
        }

        const stream: Stream | null = yield fetchStream(roomId, streamrClient)

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const privacy: PrivacySetting = yield fetchPrivacy(stream)

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
