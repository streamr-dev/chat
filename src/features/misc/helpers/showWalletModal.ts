import WalletModal from '$/components/modals/WalletModal'
import { MiscAction } from '$/features/misc'
import { WalletAction } from '$/features/wallet'
import { Layer, toaster, Toaster } from '$/utils/toaster'
import { call, cancelled, race, take } from 'redux-saga/effects'

let modal: Toaster<typeof WalletModal> | undefined

export default function showWalletModal({
    showTryMetaMask = false,
}: ReturnType<typeof MiscAction.showWalletModal>['payload']) {
    return race([
        take(WalletAction.changeAccount),
        call(function* () {
            try {
                if (!modal) {
                    modal = toaster(WalletModal, Layer.Modal)
                }

                yield modal.pop({ showTryMetaMask })
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
