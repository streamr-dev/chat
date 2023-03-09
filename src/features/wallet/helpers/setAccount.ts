import { put, take } from 'redux-saga/effects'
import { WalletAction } from '..'
import { OptionalAddress } from '$/types'
import isSameAddress from '$/utils/isSameAddress'
import getNewStreamrClient from '$/utils/getNewStreamrClient'
import getWalletProvider from '$/utils/getWalletProvider'
import handleError from '$/utils/handleError'

export default function* setAccount() {
    let lastKnownAccount: OptionalAddress = undefined

    while (true) {
        const { payload }: ReturnType<typeof WalletAction.setAccount> = yield take(
            WalletAction.setAccount
        )

        try {
            if (isSameAddress(payload, lastKnownAccount)) {
                // Skip repeated processing of the last known account.
                continue
            }

            lastKnownAccount = payload

            if (!payload) {
                yield put(WalletAction.changeAccount())

                continue
            }

            const provider = yield* getWalletProvider()

            yield put(
                WalletAction.changeAccount({
                    account: payload,
                    streamrClient: getNewStreamrClient({
                        ethereum: provider,
                    }),
                })
            )
        } catch (e) {
            handleError(e)
        }
    }
}
