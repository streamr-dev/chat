import AccountModal from '$/components/modals/AccountModal'
import showWalletModal from '$/features/misc/helpers/showWalletModal'
import { WalletAction } from '$/features/wallet'
import { toaster, Toaster } from 'toasterhea'
import { call, cancelled, race, take } from 'redux-saga/effects'
import { Layer } from '$/consts'

let modal: Toaster<typeof AccountModal> | undefined

function resetAccount() {
    return call(function* () {
        while (true) {
            const { payload }: ReturnType<typeof WalletAction.changeAccount> = yield take(
                WalletAction.changeAccount
            )

            if (!payload) {
                break
            }
        }
    })
}

export default function showAccountModal() {
    return race([
        resetAccount(),
        call(function* () {
            try {
                if (!modal) {
                    modal = toaster(AccountModal, Layer.Modal)
                }

                while (true) {
                    try {
                        yield modal.pop()

                        yield showWalletModal({})
                    } catch (e) {
                        break
                    }
                }
            } catch (e) {
                // Do nothing
            } finally {
                if (yield cancelled()) {
                    modal?.discard()
                }
            }
        }),
    ])
}
