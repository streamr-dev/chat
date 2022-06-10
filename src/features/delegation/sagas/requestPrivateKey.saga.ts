import { Provider } from '@web3-react/types'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { DelegationAction } from '..'
import { Address } from '$/types'
import getWalletAccount from '$/sagas/getWalletAccount.saga'
import getWalletProvider from '$/sagas/getWalletProvider.saga'
import handleError from '$/utils/handleError'
import requestDelegatedPrivateKey from '$/utils/requestDelegatedPrivateKey'
import { selectIsDelegating } from '$/features/delegation/selectors'
import { error, success } from '$/utils/toaster'

export default function* requestPrivateKey() {
    yield takeEvery(DelegationAction.requestPrivateKey, function* () {
        let dirty = false

        try {
            const delegating: boolean = yield select(selectIsDelegating)

            if (delegating) {
                return
            }

            yield put(DelegationAction.setDelegating(true))

            dirty = true

            const provider: Provider = yield call(getWalletProvider)

            const address: Address = yield call(getWalletAccount)

            const privateKey: string = yield requestDelegatedPrivateKey(provider, address)

            yield put(DelegationAction.setPrivateKey(privateKey))

            success('Access delegated successfully.')
        } catch (e) {
            handleError(e)

            error('Failed to delegate access.')
        } finally {
            if (dirty) {
                yield put(DelegationAction.setDelegating(false))
            }
        }
    })
}
