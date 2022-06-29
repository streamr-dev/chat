import { put } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import { info } from '$/utils/toaster'
import takeEveryUnique from '$/utils/takeEveryUnique'
import waitForPermissions from '$/utils/waitForPermissions'
import isSameAddress from '$/utils/isSameAddress'

function* onRegisterInviteAction({
    payload: { roomId, invitee, streamrClient },
}: ReturnType<typeof RoomAction.registerInvite>) {
    try {
        // Invite detector tends to trigger the invitation event prematurely. In other
        // words, at times we've gotta wait a couple of seconds for `GRANT` permission
        // to be fully established and propagated.
        yield waitForPermissions(streamrClient, roomId, (assignments) => {
            for (let i = 0; i < assignments.length; i++) {
                const a = assignments[i]

                if ('user' in a && isSameAddress(a.user, invitee)) {
                    return a.permissions.length === 1 && a.permissions[0] === StreamPermission.GRANT
                }
            }

            return false
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
