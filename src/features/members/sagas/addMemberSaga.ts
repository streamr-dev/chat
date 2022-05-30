import { Provider } from '@web3-react/types'
import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient, { StreamPermission } from 'streamr-client'
import { Address } from '../../../../types/common'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import handleError from '../../../utils/handleError'
import preflight from '../../../utils/preflight'
import { addMember, detectMembers, MemberAction } from '../actions'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'

function* onAddMemberAction({ payload: { roomId, address } }: ReturnType<typeof addMember>) {
    try {
        const provider: Provider = yield call(getWalletProviderSaga)

        const account: Address = yield call(getWalletAccountSaga)

        yield preflight({
            provider,
            address: account,
        })

        const client: StreamrClient = yield call(getWalletClientSaga)

        yield client.setPermissions({
            streamId: roomId,
            assignments: [
                {
                    user: address,
                    permissions: [
                        StreamPermission.GRANT,
                        StreamPermission.PUBLISH,
                        StreamPermission.SUBSCRIBE,
                    ],
                },
            ],
        })

        yield put(detectMembers(roomId))
    } catch (e) {
        handleError(e)
    }
}

export default function* addMemberSaga() {
    yield takeEvery(MemberAction.AddMember, onAddMemberAction)
}
