import WalletConnectionError from '$/errors/WalletConnectionError'
import { WalletAction } from '$/features/wallet'
import { WalletIntegrationId } from '$/features/wallet/types'
import getConnector from '$/utils/getConnector'
import handleError from '$/utils/handleError'
import { put } from 'redux-saga/effects'

export default function* connect(integrationId: WalletIntegrationId) {
    try {
        const [connector] = getConnector(integrationId)

        yield connector.activate()

        if (!connector.provider) {
            throw new WalletConnectionError()
        }

        yield put(WalletAction.setIntegrationId(integrationId))
    } catch (e) {
        handleError(e)
    }
}
