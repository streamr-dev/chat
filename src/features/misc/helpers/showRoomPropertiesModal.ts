import RoomPropertiesModal from '$/components/modals/RoomPropertiesModal'
import { toaster, Toaster } from 'toasterhea'
import { call, cancelled } from 'redux-saga/effects'
import { Layer } from '$/consts'

let modal: Toaster<typeof RoomPropertiesModal> | undefined

export default function showRoomPropertiesModal() {
    return call(function* () {
        try {
            if (!modal) {
                modal = toaster(RoomPropertiesModal, Layer.Modal)
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
