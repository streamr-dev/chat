import { MemberAction } from '$/features/member'
import { selectIsInviteBeingAccepted } from '$/features/member/selectors'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

export default function* acceptInvite() {
    yield takeEvery(
        MemberAction.acceptInvite,
        function* ({ payload: { roomId, address, delegatedAddress } }) {
            let dirty = false

            try {
                const isBeingAccepted: boolean = yield select(
                    selectIsInviteBeingAccepted(roomId, address)
                )

                if (isBeingAccepted) {
                    error('Invite is already being accepted.')
                    return
                }

                yield put(MemberAction.setIsAcceptingInvite({ roomId, address, state: true }))

                dirty = true

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

                success('Invite accepted.')
            } catch (e) {
                handleError(e)

                error('Failed to accept an invite.')
            } finally {
                if (dirty) {
                    yield put(MemberAction.setIsAcceptingInvite({ roomId, address, state: false }))
                }
            }
        }
    )
}
