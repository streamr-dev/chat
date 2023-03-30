import EditMembersModal from '$/components/modals/EditMembersModal'
import { toaster, Toaster } from 'toasterhea'
import { call, cancelled } from 'redux-saga/effects'
import { Layer } from '$/consts'

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
