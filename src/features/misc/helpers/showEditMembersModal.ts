import EditMembersModal from '$/components/modals/EditMembersModal'
import { Layer, toaster, Toaster } from '$/utils/toaster'
import { call, cancelled } from 'redux-saga/effects'

let modal: Toaster<typeof EditMembersModal> | undefined

export default function showEditMembersModal() {
    return call(function* () {
        try {
            if (!modal) {
                modal = toaster(EditMembersModal, Layer.Modal)
            }

            yield modal.pop()
        } catch (e) {
            // Do nothing
        } finally {
            if (yield cancelled()) {
                modal?.discard()
            }
        }
    })
}
