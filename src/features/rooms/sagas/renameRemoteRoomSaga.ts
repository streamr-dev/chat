import { Provider } from '@web3-react/types'
import { call } from 'redux-saga/effects'
import StreamrClient from 'streamr-client'
import { Address, EnhancedStream } from '../../../../types/common'
import RoomNotFoundError from '../../../errors/RoomNotFoundError'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import getWalletClientSaga from '../../wallet/sagas/getWalletClientSaga'
import getStream from '../../../utils/getStream'
import preflight from '../../../utils/preflight'
import { RoomId } from '../types'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'

export default function* renameRemoteRoomSaga(id: RoomId, name: string) {
    const provider: Provider = yield call(getWalletProviderSaga)

    const account: Address = yield call(getWalletAccountSaga)

    yield preflight({
        provider,
        address: account,
    })

    const client: StreamrClient = yield call(getWalletClientSaga)

    const stream: undefined | EnhancedStream = yield getStream(client, id)

    if (!stream) {
        throw new RoomNotFoundError(id)
    }

    stream.description = name

    stream.extensions['thechat.eth'].updatedAt = Date.now()

    yield stream.update()
}
