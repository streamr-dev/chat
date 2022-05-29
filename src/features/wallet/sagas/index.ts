import { all } from 'redux-saga/effects'
import extractWalletAccountSaga from './extractWalletAccountSaga'
import storeWalletIntegrationIdSaga from './storeWalletIntegrationIdSaga'

export default function* walletSaga() {
    yield all([storeWalletIntegrationIdSaga(), extractWalletAccountSaga()])
}
