import AddRoomModal from '$/components/modals/AddRoomModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useAddRoomModal() {
    const { open: openModal, modal } = useModalDialog(AddRoomModal)

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
