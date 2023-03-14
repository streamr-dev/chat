import WalletConnectionError from '$/errors/WalletConnectionError'
import { selectWalletIntegrationId } from '$/features/wallet/selectors'
import { WalletIntegrationId } from '$/features/wallet/types'
import getConnector from '$/utils/getConnector'
import handleError from '$/utils/handleError'
import { call, select } from 'redux-saga/effects'

export default function connectEagerly() {
    return call(function* () {
        try {
            const integrationId: WalletIntegrationId | undefined = yield select(
                selectWalletIntegrationId
            )

            const [connector] = getConnector(integrationId)

            if (typeof connector.connectEagerly !== 'function') {
                return null
            }

            yield connector.connectEagerly()

            if (!connector.provider) {
                throw new WalletConnectionError()
            }
        } catch (e) {
            handleError(e)
        }
    })
}
