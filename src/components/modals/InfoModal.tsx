import Modal, { Props as ModalProps } from '$/components/modals/Modal'
import i18n from '$/utils/i18n'
import { ReactNode } from 'react'

interface Props extends ModalProps {
    children?: ReactNode
}

export default function InfoModal({ title = i18n('infoModal.title'), children, ...props }: Props) {
    return (
        <Modal title={title} {...props}>
            {children || ''}
        </Modal>
    )
}

InfoModal.displayName = 'InfoModal'
