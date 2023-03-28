import AnonExplainerModal from '$/components/modals/AnonExplainerModal'
import { MiscAction } from '$/features/misc'
import { Layer, toaster, Toaster } from '$/utils/toaster'
import { call, cancelled } from 'redux-saga/effects'

let modal: Toaster<typeof AnonExplainerModal> | undefined

export default function showAnonExplainerModal({
    anonAccount,
    anonPrivateKey,
}: ReturnType<typeof MiscAction.showAnonExplainerModal>['payload']) {
    return call(function* () {
        try {
            if (!modal) {
                modal = toaster(AnonExplainerModal, Layer.Modal)
            }

            yield modal.pop({ anonAccount, anonPrivateKey })
        } catch (e) {
            // Do nothing
        } finally {
            if (yield cancelled()) {
                modal?.discard()
            }
        }
    })
}
