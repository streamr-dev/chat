import { Provider } from '@web3-react/types'
import { call, put, select } from 'redux-saga/effects'
import { Address } from '$/types'
import MissingDelegatedClientError from '$/errors/MissingDelegatedClientError'
import { DelegationAction } from '$/features/delegation'
import { selectDelegatedClient } from '$/features/delegation/selectors'
import { DelegationState } from '$/features/delegation/types'
import requestDelegatedPrivateKey from '$/utils/requestDelegatedPrivateKey'
import getWalletAccount from './getWalletAccount.saga'
import getWalletProvider from './getWalletProvider.saga'

export default function* getDelegatedClient() {
    let client: DelegationState['client'] = yield select(selectDelegatedClient)

    if (!client) {
        const provider: Provider = yield call(getWalletProvider)

        const owner: Address = yield call(getWalletAccount)

        const privateKey: string = yield requestDelegatedPrivateKey(provider, owner)

        yield put(DelegationAction.setPrivateKey(privateKey))

        client = yield select(selectDelegatedClient)

        if (!client) {
            throw new MissingDelegatedClientError()
        }
    }

    return client
}
