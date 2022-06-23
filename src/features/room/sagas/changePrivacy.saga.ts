import { put } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'

function* onChangePrivacyAction({
    payload: { roomId, privacy, provider, requester, streamrClient },
}: ReturnType<typeof RoomAction.changePrivacy>) {
    let name

    try {
        yield preflight({
            provider,
            requester,
        })

        const stream: undefined | Stream = yield getStream(streamrClient, roomId)

        const permissions: StreamPermission[] =
            privacy === PrivacySetting.Public ? [StreamPermission.SUBSCRIBE] : []

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const { description = 'Unnamed room' } = stream

        name = description

        yield streamrClient.setPermissions({
            streamId: roomId,
            assignments: [
                {
                    public: true,
                    permissions,
                },
            ],
        })

        yield put(
            RoomAction.setLocalPrivacy({
                roomId,
                privacy,
            })
        )

        success(`Update privacy for "${name}".`)
    } catch (e) {
        handleError(e)

        if (name) {
            error(`Failed to update privacy for "${name}".`)
            return
        }

        error('Failed to update privacy.')
    }
}

export default function* changePrivacy() {
    yield takeEveryUnique(RoomAction.changePrivacy, onChangePrivacyAction)
}
