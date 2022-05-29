import { takeLatest } from 'redux-saga/effects'
import { StorageKey } from '../../../../types/common'
import { setWalletIntegrationId, WalletAction } from '../actions'

function onSetWalletIntegrationIdAction({
    payload: integrationId,
}: ReturnType<typeof setWalletIntegrationId>) {
    if (integrationId) {
        localStorage.setItem(StorageKey.WalletIntegrationId, integrationId)
    } else {
        localStorage.removeItem(StorageKey.WalletIntegrationId)
    }
}

export default function* storeWalletIntegrationIdSaga() {
    yield takeLatest(WalletAction.SetWalletIntegrationId, onSetWalletIntegrationIdAction)
}
