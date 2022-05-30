import { Provider } from '@web3-react/types'
import { call, put, takeEvery } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address } from '../../../../types/common'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import handleError from '../../../utils/handleError'
import preflight from '../../../utils/preflight'
import { detectMembers, MemberAction, removeMember } from '../actions'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'

function* onRemoveMemberAction({ payload: { roomId, address } }: ReturnType<typeof removeMember>) {
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
                    permissions: [],
                },
            ],
        })

        yield put(detectMembers(roomId))
    } catch (e) {
        handleError(e)
    }
}

export default function* removeMemberSaga() {
    yield takeEvery(MemberAction.RemoveMember, onRemoveMemberAction)
}
