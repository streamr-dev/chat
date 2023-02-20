import RoomPropertiesModal from '$/components/modals/RoomPropertiesModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useRoomPropertiesModal() {
    const { open: openModal, modal } = useModalDialog(RoomPropertiesModal)

    const open = useCallback(async () => {
        try {
            await openModal()
        } catch (e) {
            // Noop
        }
    }, [openModal])

    return {
        open,
        modal,
    }
}
