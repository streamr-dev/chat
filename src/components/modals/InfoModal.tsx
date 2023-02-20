import Modal, { Props as ModalProps } from '$/components/modals/Modal'
import { ReactNode } from 'react'

interface Props extends ModalProps {
    children?: ReactNode
}

export default function InfoModal({ title = 'Info', children, ...props }: Props) {
    return (
        <Modal title={title} {...props}>
            {children || ''}
        </Modal>
    )
}

InfoModal.displayName = 'InfoModal'
