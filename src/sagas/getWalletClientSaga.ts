import { select } from 'redux-saga/effects'
import MissingWalletClientError from '../errors/MissingWalletClientError'
import { selectWalletClient } from '../features/wallet/selectors'
import { WalletState } from '../features/wallet/types'

export default function* getWalletClientSaga() {
    const client: WalletState['client'] = yield select(selectWalletClient)

    if (!client) {
        throw new MissingWalletClientError()
    }

    return client
}
