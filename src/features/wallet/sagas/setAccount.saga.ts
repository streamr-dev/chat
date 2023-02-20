import { put, take } from 'redux-saga/effects'
import { WalletAction } from '..'
import { OptionalAddress } from '$/types'
import isSameAddress from '$/utils/isSameAddress'
import StreamrClient from 'streamr-client'

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

            return
        }

        const { account, provider } = payload

        yield put(
            WalletAction.changeAccount({
                account,
                provider,
                streamrClient: new StreamrClient({
                    auth: {
                        ethereum: provider,
                    },
                    encryption: {
                        litProtocolEnabled: true,
                        litProtocolLogging: false,
                    },
                    gapFill: false,
                }),
            })
        )
    }
}
