import { put } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'
import { RoomAction } from '..'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import waitForPermissions from '$/utils/waitForPermissions'
import isSameAddress from '$/utils/isSameAddress'
import toast from '$/features/toaster/helpers/toast'

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
                    return (
                        a.permissions.length === 2 &&
                        a.permissions.includes(StreamPermission.GRANT) &&
                        a.permissions.includes(StreamPermission.SUBSCRIBE)
                    )
                }
            }

            return false
        })

        yield toast({
            title: "You've got an invite",
            desc: 'Room list will reflect it shortly',
        })

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
