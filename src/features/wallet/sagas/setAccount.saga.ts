import { call, put, take } from 'redux-saga/effects'
import { WalletAction } from '..'
import handleError from '$/utils/handleError'
import { DelegationAction } from '../../delegation'
import { RoomAction } from '$/features/room'
import { IPreference } from '$/features/preferences/types'
import db from '$/utils/db'
import { EnsAction } from '$/features/ens'
import { Address, OptionalAddress } from '$/types'
import isSameAddress from '$/utils/isSameAddress'
import { Flag } from '$/features/flag/types'

function preselectRoom(account: Address) {
    return call(function* () {
        const preferences: null | IPreference = yield db.preferences
            .where('owner')
            .equals(account.toLowerCase())
            .first()

        if (!preferences) {
            yield put(RoomAction.select(undefined))
            return
        }

        yield put(RoomAction.select(preferences.selectedRoomId))
    })
}

export default function* setAccount() {
    let lastAccount: OptionalAddress = undefined

    while (true) {
        const {
            payload: { account, provider },
        }: ReturnType<typeof WalletAction.setAccount> = yield take(WalletAction.setAccount)

        if (isSameAddress(account, lastAccount)) {
            // Skip repeated processing of the last known account.
            continue
        }

        lastAccount = account

        // Reset previous private key (different account = different private key).
        yield put(DelegationAction.setPrivateKey(undefined))

        if (!account) {
            // Deselect current room.
            yield put(RoomAction.select(undefined))
            continue
        }

        yield put(EnsAction.fetchNames([account]))

        try {
            yield preselectRoom(account)
        } catch (e) {
            handleError(e)
        }

        if (!provider) {
            continue
        }

        yield put(
            DelegationAction.requestPrivateKey({
                owner: account,
                provider,
                fingerprint: Flag.isAccessBeingDelegated(account),
            })
        )
    }
}
