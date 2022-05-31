import { Provider } from '@web3-react/types'
import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address } from '../../../../types/common'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import preflight from '../../../utils/preflight'
import { detectMembers, setMemberPermissions } from '../actions'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'
import handleError from '../../../utils/handleError'
import { invalidatePermissions } from '../../permissions/actions'
import { MemberAction } from '../types'

function* onSetMemberPermissionsAction({
    payload: { roomId: streamId, address: user, permissions },
}: ReturnType<typeof setMemberPermissions>) {
    try {
        const provider: Provider = yield call(getWalletProviderSaga)

        const account: Address = yield call(getWalletAccountSaga)

        yield preflight({
            provider,
            address: account,
        })

        const client: StreamrClient = yield call(getWalletClientSaga)

        yield client.setPermissions({
            streamId,
            assignments: [
                {
                    user,
                    permissions,
                },
            ],
        })

        yield put(detectMembers(streamId))

        yield put(invalidatePermissions({ roomId: streamId, address: user }))
    } catch (e) {
        handleError(e)
    }
}

export default function* setMemberPermissionsSaga() {
    yield takeEvery(MemberAction.SetMemberPermissions, onSetMemberPermissionsAction)
}
