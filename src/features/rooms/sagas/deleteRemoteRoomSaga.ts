import { Provider } from '@web3-react/types'
import { call } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address } from '../../../../types/common'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import preflight from '../../../utils/preflight'
import { RoomId } from '../types'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'

export default function* deleteRemoteRoomSaga(id: RoomId) {
    const provider: Provider = yield call(getWalletProviderSaga)

    const account: Address = yield call(getWalletAccountSaga)

    yield preflight({
        provider,
        address: account,
    })

    const client: StreamrClient = yield call(getWalletClientSaga)

    yield client.deleteStream(id)
}
