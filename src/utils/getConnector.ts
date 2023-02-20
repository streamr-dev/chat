import { initializeConnector } from '@web3-react/core'
import { EMPTY } from '@web3-react/empty'
import { ConnectorMap, WalletState } from '$/features/wallet/types'
import integrations from './integrations'

type Connector = ReturnType<typeof initializeConnector>

let fallbackConnector: Connector

const connectors: ConnectorMap = {}

export default function getConnector(integrationId: WalletState['integrationId']): Connector {
    if (!integrationId) {
        if (!fallbackConnector) {
            fallbackConnector = initializeConnector<any>(() => EMPTY)
        }

        // Limit edge case scenarios by falling back to the "empty" connector.
        return fallbackConnector
    }

    const integration = integrations.get(integrationId)

    if (!integration) {
        // Step back. Act as if the integrationId is `undefined`.
        return getConnector(undefined)
    }

    let connector = connectors[integrationId]

    if (!connector) {
        connector = initializeConnector<ReturnType<typeof integration.initializer>>(
            integration.initializer,
            integration.allowedChainIds
        )

        // We do the lazy-load dance so that connectors don't get initialized prematurely.
        connectors[integrationId] = connector
    }

    return connector
}
