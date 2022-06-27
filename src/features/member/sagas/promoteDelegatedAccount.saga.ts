import { MemberAction } from '$/features/member'
import setMultiplePermissions from '$/sagas/setMultiplePermissions.saga'
import handleError from '$/utils/handleError'
import takeEveryUnique from '$/utils/takeEveryUnique'
import { error, success } from '$/utils/toaster'
import { call } from 'redux-saga/effects'
import { StreamPermission } from 'streamr-client'

function* onPromoteDelegatedAccountAction({
    payload: { roomId, delegatedAddress, provider, requester, streamrClient },
}: ReturnType<typeof MemberAction.promoteDelegatedAccount>) {
    try {
        yield call(
            setMultiplePermissions,
            roomId,
            [
                {
                    user: delegatedAddress,
                    permissions: [StreamPermission.PUBLISH, StreamPermission.SUBSCRIBE],
                },
            ],
            {
                provider,
                requester,
                streamrClient,
            }
        )

        success('Delegated account has been promoted.')
    } catch (e) {
        handleError(e)

        error('Failed to promote the delegated account.')
    }
}

export default function* promoteDelegatedAccount() {
    yield takeEveryUnique(MemberAction.promoteDelegatedAccount, onPromoteDelegatedAccountAction)
}
