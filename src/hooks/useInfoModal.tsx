import InfoModal from '$/components/modals/InfoModal'
import useModalDialog from '$/hooks/useModalDialog'
import { ComponentProps, ReactNode, useCallback } from 'react'

export default function useInfoModal() {
    const { open: openModal, close, modal } = useModalDialog(InfoModal, {})

    const open = useCallback(
        async (info: ReactNode, props: Omit<ComponentProps<typeof InfoModal>, 'children'>) => {
            while (true) {
                try {
                    await openModal({ ...props, children: info })
                } catch (e) {
                    break
                }
            }
        },
        [openModal]
    )

    return {
        open,
        close,
        modal,
    }
}
