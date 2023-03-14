import { StorageKey } from '$/types'
import { WalletIntegrationId } from '$/features/wallet/types'

export default function storeIntegrationId(integrationId: WalletIntegrationId | undefined) {
    try {
        if (integrationId) {
            localStorage.setItem(StorageKey.WalletIntegrationId, integrationId)
        } else {
            localStorage.removeItem(StorageKey.WalletIntegrationId)
        }
    } catch (e) {
        // Do nothing
    }
}
