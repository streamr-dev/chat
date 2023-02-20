import { WalletAction } from '$/features/wallet'
import connectWallet from '$/utils/connectWallet'
import handleError from '$/utils/handleError'
import { put, takeLeading } from 'redux-saga/effects'

function* onConnectAction({
    payload: { integrationId, eager },
}: ReturnType<typeof WalletAction.connect>) {
    try {
        const connection: Awaited<ReturnType<typeof connectWallet>> = yield connectWallet(
            integrationId,
            eager
        )

        if (!connection) {
            yield put(WalletAction.setAccount())
            return
        }

        const { provider, account } = connection

        yield put(WalletAction.setAccount({ account, provider }))

        yield put(WalletAction.setIntegrationId(integrationId))
    } catch (e) {
        handleError(e)
    }
}

export default function* connect() {
    yield takeLeading(WalletAction.connect, onConnectAction)
}
