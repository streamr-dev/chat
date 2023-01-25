import EditMembersModal from '$/components/modals/EditMembersModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useEditMembersModal() {
    const { open: openModal, modal } = useModalDialog(EditMembersModal)

    const open = useCallback(async () => {
        try {
            await openModal()
        } catch (e) {
            // Ignore
        }
    }, [openModal])

    return {
        open,
        modal,
    }
}
