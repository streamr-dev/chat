import HowItWorksModal from '$/components/modals/HowItWorksModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useHowItWorksModal() {
    const { open: openModal, modal } = useModalDialog(HowItWorksModal)

    const open = useCallback(async () => {
        try {
            await openModal()
        } catch (e) {
            // Ignore.
        }
    }, [openModal])

    return {
        open,
        modal,
    }
}
