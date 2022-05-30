import { select } from 'redux-saga/effects'
import MissingWalletClientError from '../../../errors/MissingWalletClientError'
import { selectWalletClient } from '../selectors'
import { WalletState } from '../types'

export default function* getWalletClientSaga() {
    const client: WalletState['client'] = yield select(selectWalletClient)

    if (!client) {
        throw new MissingWalletClientError()
    }

    return client
}
