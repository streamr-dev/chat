import { AnonAction } from '$/features/anon'
import { DelegationAction } from '$/features/delegation'
import { EnsAction } from '$/features/ens'
import { Flag } from '$/features/flag/types'
import { IPreference } from '$/features/preferences/types'
import { RoomAction } from '$/features/room'
import { RoomsAction } from '$/features/rooms'
import { WalletAction } from '$/features/wallet'
import db from '$/utils/db'
import { call, put } from 'redux-saga/effects'

export default function changeAccount(
    payload: ReturnType<typeof WalletAction.changeAccount>['payload']
) {
    return call(function* () {
        // Reset previous private key (different account = different private key).
        yield put(DelegationAction.setPrivateKey(undefined))

        // Reset all anon wallets and clients.
        yield put(AnonAction.reset())

        if (!payload?.account) {
            // Deselect current room.
            yield put(RoomAction.select(undefined))

            return
        }

        const { account } = payload

        yield put(
            RoomsAction.fetch({
                requester: account,
            })
        )

        yield put(
            RoomAction.pinSticky({
                requester: account,
                fingerprint: Flag.isPinningStickyRooms(account),
            })
        )

        yield put(EnsAction.fetchNames([account]))

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
                    fingerprint: Flag.isAccessBeingDelegated(account),
                })
            )
        } catch (e) {
            // ¯\_(ツ)_/¯
        }
    })
}
