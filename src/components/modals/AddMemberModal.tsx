import { useState } from 'react'
import isBlank from '$/utils/isBlank'
import Form from '../Form'
import Label from '../Label'
import Submit from '../Submit'
import TextField from '../TextField'
import { Address } from '$/types'
import Modal, { AbortReason, Props as ModalProps } from '$/components/modals/Modal'
import useCanGrant from '$/hooks/useCanGrant'

interface Props extends ModalProps {
    onProceed?: (address: Address) => void
}

export default function AddMemberModal({ title = 'Add member', onProceed, ...props }: Props) {
    const [address, setAddress] = useState<Address>('')

    const canGrant = useCanGrant()

    const canSubmit = !isBlank(address) && canGrant

    return (
        <Modal
            {...props}
            title={title}
            onBeforeAbort={(reason) => {
                if (reason === AbortReason.Backdrop) {
                    return isBlank(address)
                }
            }}
        >
            <Form
                onSubmit={() => {
                    if (canSubmit) {
                        onProceed?.(address)
                    }
                }}
            >
                <Label>ENS name or 0x address</Label>
                <TextField
                    autoFocus
                    placeholder="0x…"
                    value={address}
                    onChange={(e) => void setAddress(e.target.value)}
                />
                <Submit label="Add" disabled={!canSubmit} />
            </Form>
        </Modal>
    )
}

AddMemberModal.displayName = 'AddMemberModal'
