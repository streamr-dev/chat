import { Provider } from '@web3-react/types'
import { call, put, takeEvery } from 'redux-saga/effects'
import { DelegationAction } from '..'
import { Address } from '$/types'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import getWalletProvider from '$/sagas/getWalletProvider.saga'
import handleError from '$/utils/handleError'
import requestDelegatedPrivateKey from '$/utils/requestDelegatedPrivateKey'

export default function* requestPrivateKey() {
    yield takeEvery(DelegationAction.requestPrivateKey, function* () {
        try {
            const provider: Provider = yield call(getWalletProvider)

            const address: Address = yield call(getWalletAccount)

            const privateKey: string = yield requestDelegatedPrivateKey(provider, address)

            yield put(DelegationAction.setPrivateKey(privateKey))
        } catch (e) {
            handleError(e)
        }
    })
}
