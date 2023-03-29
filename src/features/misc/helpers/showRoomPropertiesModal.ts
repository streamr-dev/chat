import RoomPropertiesModal from '$/components/modals/RoomPropertiesModal'
import { Layer, toaster, Toaster } from '$/utils/toaster'
import { call, cancelled } from 'redux-saga/effects'

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
