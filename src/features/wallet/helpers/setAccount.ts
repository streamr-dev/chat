import { put, take } from 'redux-saga/effects'
import { WalletAction } from '..'
import { OptionalAddress } from '$/types'
import isSameAddress from '$/utils/isSameAddress'
import getNewStreamrClient from '$/utils/getNewStreamrClient'

export default function* setAccount() {
    let lastKnownAccount: OptionalAddress = undefined

    while (true) {
        const { payload }: ReturnType<typeof WalletAction.setAccount> = yield take(
            WalletAction.setAccount
        )

        if (isSameAddress(payload?.account, lastKnownAccount)) {
            // Skip repeated processing of the last known account.
            continue
        }

        lastKnownAccount = payload?.account

        if (!payload) {
            yield put(WalletAction.changeAccount())

            continue
        }

        const { account, provider } = payload

        yield put(
            WalletAction.changeAccount({
                account,
                provider,
                streamrClient: getNewStreamrClient({
                    ethereum: provider,
                }),
            })
        )
    }
}
