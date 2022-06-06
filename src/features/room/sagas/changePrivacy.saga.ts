import { call, put, select, takeEvery } from 'redux-saga/effects'
import StreamrClient, { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import { PrivacySetting } from '../../../../types/common'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletClient from '../../../sagas/getWalletClient.saga'
import getStream from '../../../utils/getStream'
import handleError from '../../../utils/handleError'
import { error, success } from '../../../utils/toaster'
import { selectPrivacyChanging } from '../selectors'

function* onChangePrivacyAction({
    payload: { roomId, privacy },
}: ReturnType<typeof RoomAction.changePrivacy>) {
    const changing: boolean = yield select(selectPrivacyChanging(roomId))

    if (changing) {
        // Already changing. Skipping.
        return
    }

    yield put(
        RoomAction.setChangingPrivacy({
            roomId,
            state: true,
        })
    )

    try {
        const client: StreamrClient = yield call(getWalletClient)

        const stream: undefined | Stream = yield getStream(client, roomId)

        const permissions: StreamPermission[] =
            privacy === PrivacySetting.Public ? [StreamPermission.SUBSCRIBE] : []

        if (!stream) {
            throw new RoomNotFoundError(roomId)
        }

        const { description: name = 'Unnamed room' } = stream

        try {
            yield client.setPermissions({
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
            console.warn(e)
            error(`Failed to update privacy for "${name}".`)
        }
    } catch (e) {
        handleError(e)
    }

    yield put(
        RoomAction.setChangingPrivacy({
            roomId,
            state: false,
        })
    )
}

export default function* changePrivacy() {
    yield takeEvery(RoomAction.changePrivacy, onChangePrivacyAction)
}
