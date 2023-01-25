import WalletModal from '$/components/modals/WalletModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useWalletModal() {
    const { open: openModal, modal } = useModalDialog(WalletModal)

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
