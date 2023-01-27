import Modal, { Props as ModalProps } from '$/components/modals/Modal'

interface TokenParams {
    nft: boolean
}

interface Props extends ModalProps {
    onProceed?: (params: TokenParams) => void
}

export default function AddTokenGatedRoomModal({
    title = 'Add new token gated room',
    onProceed,
    ...props
}: Props) {
    return (
        <Modal {...props} title={title}>
            Hej ty!
        </Modal>
    )
}
