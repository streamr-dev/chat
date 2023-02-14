import { AnonAction } from '$/features/anon'
import { DelegationAction } from '$/features/delegation'
import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'
import { IPreference } from '$/features/preferences/types'
import { RoomAction } from '$/features/room'
import { WalletAction } from '$/features/wallet'
import db from '$/utils/db'
import { put, takeEvery } from 'redux-saga/effects'

export default function* changeAccount() {
    yield takeEvery(WalletAction.changeAccount, function* ({ payload: { account, provider } }) {
        // Reset previous private key (different account = different private key).
        yield put(DelegationAction.setPrivateKey(undefined))

        // Reset all anon wallets and clients.
        yield put(AnonAction.reset())

        if (!account) {
            // Deselect current room.
            yield put(RoomAction.select(undefined))

            return
        }

        yield put(EnsAction.fetchNames([account]))

        if (!provider) {
            throw new Error('Provider is missing')
        }

        try {
            const preferences: null | IPreference = yield db.preferences
                .where({ owner: account.toLowerCase() })
                .first()

            if (!preferences?.retrieveHotWalletImmediately) {
                return
            }

            yield put(
                DelegationAction.requestPrivateKey({
                    owner: account,
                    provider,
                    fingerprint: Flag.isAccessBeingDelegated(account),
                })
            )
        } catch (e) {
            // ¯\_(ツ)_/¯
        }
    })
}
