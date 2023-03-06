import Modal, { Props as ModalProps } from '$/components/modals/Modal'
import { I18n } from '$/utils/I18n'
import { ReactNode } from 'react'

interface Props extends ModalProps {
    children?: ReactNode
}

export default function InfoModal({ title = I18n.infoModal.title(), children, ...props }: Props) {
    return (
        <Modal title={title} {...props}>
            {children || ''}
        </Modal>
    )
}

InfoModal.displayName = 'InfoModal'
