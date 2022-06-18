import { MemberAction } from '$/features/member'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

function* onAcceptInviteAction({
    payload: { roomId, address, delegatedAddress },
}: ReturnType<typeof MemberAction.acceptInvite>) {
    let succeeded = false

    try {
        yield call(setMultiplePermissions, roomId, [
            {
                user: delegatedAddress,
                permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
            },
            {
                user: address,
                permissions: [StreamPermission.GRANT, StreamPermission.EDIT],
            },
        ])

        succeeded = true
    } catch (e) {
        handleError(e)
    }

    if (succeeded) {
        success('Invite accepted.')
        return
    }

    error('Failed to accept an invite.')
}

export default function* acceptInvite() {
    yield takeEveryUnique(MemberAction.acceptInvite, onAcceptInviteAction)
}
