import adapters from '../../../utils/web3/adapters'
import Modal, { ModalProps } from '../../Modal'
import WalletOption from './WalletOption'

export default function WalletModal(props: ModalProps) {
    return (
        <Modal {...props} title="Select a wallet">
            {adapters.map((adapter) => (
                <WalletOption key={adapter.id} walletAdapter={adapter} />
            ))}
        </Modal>
    )
}
