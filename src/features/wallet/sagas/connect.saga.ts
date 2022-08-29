import { WalletAction } from '$/features/wallet'
import getConnector from '$/utils/getConnector'
import handleError from '$/utils/handleError'
import { takeLeading } from 'redux-saga/effects'

function* onConnectAction({ payload: integrationId }: ReturnType<typeof WalletAction.connect>) {
    try {
        const [connector] = getConnector(integrationId)

        try {
            yield connector.activate()
        } catch (e) {
            console.warn(`Failed to activate using "${integrationId}"`, e)
        }
    } catch (e) {
        handleError(e)
    }
}

export default function* connect() {
    yield takeLeading(WalletAction.connect, onConnectAction)
}
