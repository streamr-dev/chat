import AddTokenGatedRoomModal from '$/components/modals/AddTokenGatedRoomModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useHowItWorksModal() {
    const { open: openModal, modal } = useModalDialog(AddTokenGatedRoomModal)

    const open = useCallback(async () => {
        try {
            await openModal({
                subtitle: 'Room name :D',
            })
        } catch (e) {
            // Ignore.
        }
    }, [openModal])

    return {
        open,
        modal,
    }
}
