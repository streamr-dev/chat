import { put, take } from 'redux-saga/effects'
import { WalletAction } from '..'
import { OptionalAddress } from '$/types'
import isSameAddress from '$/utils/isSameAddress'

export default function* setAccount() {
    let lastKnownAccount: OptionalAddress = undefined

    while (true) {
        const {
            payload: { account, provider },
        }: ReturnType<typeof WalletAction.setAccount> = yield take(WalletAction.setAccount)

        if (isSameAddress(account, lastKnownAccount)) {
            // Skip repeated processing of the last known account.
            continue
        }

        lastKnownAccount = account

        yield put(
            WalletAction.changeAccount({
                account,
                provider,
            })
        )
    }
}
