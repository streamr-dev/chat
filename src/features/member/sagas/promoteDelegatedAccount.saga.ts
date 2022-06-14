import { MemberAction } from '$/features/member'
import { selectIsDelegatedAccountBeingPromoted } from '$/features/member/selectors'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import handleError from '$/utils/handleError'
import { error, success } from '$/utils/toaster'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

export default function* promoteDelegatedAccount() {
    yield takeEvery(
        MemberAction.promoteDelegatedAccount,
        function* ({ payload: { roomId, delegatedAddress } }) {
            let dirty = false

            try {
                const isPromoting: boolean = yield select(
                    selectIsDelegatedAccountBeingPromoted(roomId, delegatedAddress)
                )

                if (isPromoting) {
                    error('Delegated account is already being promoted.')
                    return
                }

                yield put(
                    MemberAction.setIsPromotingDelegatedAccount({
                        roomId,
                        delegatedAddress,
                        state: true,
                    })
                )

                dirty = true

                yield call(setMultiplePermissions, roomId, [
                    {
                        user: delegatedAddress,
                        permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                    },
                ])

                success('Delegated account has been promoted.')
            } catch (e) {
                handleError(e)

                error('Failed to promote the delegated account.')
            } finally {
                if (dirty) {
                    yield put(
                        MemberAction.setIsPromotingDelegatedAccount({
                            roomId,
                            delegatedAddress,
                            state: false,
                        })
                    )
                }
            }
        }
    )
}
