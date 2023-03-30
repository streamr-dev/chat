import HowItWorksModal from '$/components/modals/HowItWorksModal'
import { WalletAction } from '$/features/wallet'
import { toaster, Toaster } from 'toasterhea'
import { call, cancelled, race, take } from 'redux-saga/effects'
import { Layer } from '$/consts'

let modal: Toaster<typeof HowItWorksModal> | undefined

export default function showHowItWorksModal() {
    return race([
        take(WalletAction.changeAccount),
        call(function* () {
            try {
                if (!modal) {
                    modal = toaster(HowItWorksModal, Layer.Modal)
                }

                yield modal.pop()
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
