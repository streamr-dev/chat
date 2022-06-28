import { put, retry } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import RoomNotFoundError from '$/errors/RoomNotFoundError'
import getStream from '$/utils/getStream'
import handleError from '$/utils/handleError'
import { info } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import getUserPermissions from '$/utils/getUserPermissions'

function* onRegisterInviteAction({
    payload: { roomId, invitee, streamrClient },
}: ReturnType<typeof RoomAction.registerInvite>) {
    try {
        // Invite detector tends to trigger the invitation event prematurely. In other
        // words, at times we've gotta wait a couple of seconds for `GRANT` permission
        // to be fully established and propagated. 30s+ usually does it.
        yield retry(10, 3000, function* () {
            const stream: undefined | Stream = yield getStream(streamrClient, roomId)

            if (!stream) {
                throw new RoomNotFoundError(roomId)
            }

            const [permissions] = yield getUserPermissions(invitee, stream)

            if (permissions.length !== 1 || permissions[0] !== StreamPermission.GRANT) {
                throw new Error('`GRANT` permission could not be found')
            }
        })

        info("You've got an invite. Room list will reflect it shortly.")

        yield put(
            RoomAction.fetch({
                roomId,
                requester: invitee,
                streamrClient,
            })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* registerInvite() {
    yield takeEveryUnique(RoomAction.registerInvite, onRegisterInviteAction)
}
