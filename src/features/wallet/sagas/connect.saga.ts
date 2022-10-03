import { DelegationAction } from '$/features/delegation'
import { Flag } from '$/features/flag/types'
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
            yield put(WalletAction.setAccount({ account: null }))
            return
        }

        const { provider, account } = connection

        yield put(WalletAction.setAccount({ account, provider }))

        yield put(WalletAction.setIntegrationId(integrationId))

        yield put(
            DelegationAction.requestPrivateKey({
                owner: account,
                provider,
                fingerprint: Flag.isAccessBeingDelegated(account),
            })
        )
    } catch (e) {
        handleError(e)
    }
}

export default function* connect() {
    yield takeLeading(WalletAction.connect, onConnectAction)
}
