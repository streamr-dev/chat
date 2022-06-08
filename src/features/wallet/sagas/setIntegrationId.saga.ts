import { takeLatest } from 'redux-saga/effects'
import { WalletAction } from '..'
import { StorageKey } from '../../../../types/common'

function onSetIntegrationIdAction({
    payload: integrationId,
}: ReturnType<typeof WalletAction.setIntegrationId>) {
    if (integrationId) {
        localStorage.setItem(StorageKey.WalletIntegrationId, integrationId)
    } else {
        localStorage.removeItem(StorageKey.WalletIntegrationId)
    }
}

export default function* setIntegrationId() {
    yield takeLatest(WalletAction.setIntegrationId, onSetIntegrationIdAction)
}
