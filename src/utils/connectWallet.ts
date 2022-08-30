import WalletConnectionError from '$/errors/WalletConnectionError'
import { WalletIntegrationId } from '$/features/wallet/types'
import getAccount from '$/utils/getAccount'
import getConnector from '$/utils/getConnector'

export default async function connectWallet(integrationId: WalletIntegrationId, eager: boolean) {
    const [connector] = getConnector(integrationId)

    if (eager) {
        if (typeof connector.connectEagerly !== 'function') {
            return null
        }

        await connector.connectEagerly()
    } else {
        await connector.activate()
    }

    if (!connector.provider) {
        throw new WalletConnectionError()
    }

    const account = await getAccount(connector.provider)

    if (!account) {
        throw new WalletConnectionError()
    }

    return {
        provider: connector.provider,
        account,
    }
}
