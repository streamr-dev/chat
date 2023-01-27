import AccountModal from '$/components/modals/AccountModal'
import WalletModal from '$/components/modals/WalletModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useAccountModal() {
    const { open: openAccountModal, modal: accountModal } = useModalDialog(AccountModal)

    const { open: openWalletModal, modal: walletModal } = useModalDialog(WalletModal)

    const open = useCallback(async () => {
        while (true) {
            try {
                await openAccountModal()

                try {
                    await openWalletModal()
                } catch (e) {
                    // Noop.
                }
            } catch (e) {
                break
            }
        }
    }, [openAccountModal, openWalletModal])

    return {
        open,
        modal: (
            <>
                {accountModal}
                {walletModal}
            </>
        ),
    }
}
