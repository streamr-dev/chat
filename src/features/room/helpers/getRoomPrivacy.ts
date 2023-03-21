import { call, put, select } from 'redux-saga/effects'
import { Stream } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import fetchStream from '$/utils/fetchStream'
import { selectPrivacy } from '$/hooks/usePrivacy'
import fetchPrivacy from '$/utils/fetchPrivacy'

export default function getRoomPrivacy({
    roomId,
}: ReturnType<typeof RoomAction.getPrivacy>['payload']) {
    return call(function* () {
        try {
            const currentPrivacy: PrivacySetting | undefined = yield select(selectPrivacy(roomId))

            if (currentPrivacy) {
                return
            }

            const stream: Stream | null = yield fetchStream(roomId)

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
    })
}
