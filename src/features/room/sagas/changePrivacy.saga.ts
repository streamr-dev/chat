import { put } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '$/types'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import handleError from '$/utils/handleError'
import preflight from '$/utils/preflight'
import { error, success } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import getRoomMetadata from '$/utils/getRoomMetadata'

function* onChangePrivacyAction({
    payload: { roomId, privacy, provider, requester, streamrClient },
}: ReturnType<typeof RoomAction.changePrivacy>) {
    let teardown: () => void = () => {
        error('Failed to update privacy.')
    }

    try {
        yield preflight({
            provider,
            requester,
        })

        const stream: null | Stream = yield streamrClient.getStream(roomId)

        const permissions: StreamPermission[] =
            privacy === PrivacySetting.Public ? [StreamPermission.SUBSCRIBE] : []

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const { name = 'Unnamed room' } = getRoomMetadata(stream)

        teardown = () => {
            error(`Failed to update privacy for "${name}".`)
        }

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
        teardown()
    }
}

export default function* changePrivacy() {
    yield takeEveryUnique(RoomAction.changePrivacy, onChangePrivacyAction)
}
