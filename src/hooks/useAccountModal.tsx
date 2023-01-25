import AccountModal from '$/components/modals/AccountModal'
import WalletModal from '$/components/modals/WalletModal'
import useModalDialog from '$/hooks/useModalDialog'
import { useCallback } from 'react'

export default function useAccountModal() {
    const {
        open: openAccountModal,
        toggle: toggleAccountModal,
        modal: accountModal,
    } = useModalDialog(AccountModal)

    const { open: openWalletModal, modal: walletModal } = useModalDialog(WalletModal)

    const open = useCallback(async () => {
        try {
            await openAccountModal({
                async onChangeClick() {
                    toggleAccountModal(false)

                    try {
                        await openWalletModal({
                            onAbort() {
                                toggleAccountModal(true)
                            },
                        })
                    } catch (e) {
                        // ignore
                    }
                },
            })
        } catch (e) {
            // Ignore
        }
    }, [openAccountModal, openWalletModal, toggleAccountModal])

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
