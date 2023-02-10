import { DelegationAction } from '$/features/delegation'
import { EnsAction } from '$/features/ens'
import { RoomAction } from '$/features/room'
import { WalletAction } from '$/features/wallet'
import { put, takeEvery } from 'redux-saga/effects'

export default function* changeAccount() {
    yield takeEvery(WalletAction.changeAccount, function* ({ payload: { account, provider } }) {
        // Reset previous private key (different account = different private key).
        yield put(DelegationAction.setPrivateKey(undefined))

        if (!account) {
            // Deselect current room.
            yield put(RoomAction.select(undefined))
            return
        }

        yield put(EnsAction.fetchNames([account]))

        if (!provider) {
            throw new Error('Provider is missing')
        }
    })
}
