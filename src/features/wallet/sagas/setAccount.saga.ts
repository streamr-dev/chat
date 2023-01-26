import { put, take } from 'redux-saga/effects'
import { WalletAction } from '..'
import { DelegationAction } from '../../delegation'
import { RoomAction } from '$/features/room'
import { EnsAction } from '$/features/ens'
import { OptionalAddress } from '$/types'
import isSameAddress from '$/utils/isSameAddress'
import { Flag } from '$/features/flag/types'

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

        if (!provider) {
            throw new Error('Provider is missing')
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
