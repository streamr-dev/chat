import { useState } from 'react'
import isBlank from '../utils/isBlank'
import Form from './Form'
import Label from './Label'
import Modal, { ModalProps } from './Modal'
import Submit from './Submit'
import TextField from './TextField'

type Props = ModalProps & {
    onSubmit?: (address: string) => void
}

export default function AddMemberModal({ onSubmit, ...props }: Props) {
    const [address, setAddress] = useState<string>('')

    const canSubmit = !isBlank(address)

    return (
        <Modal
            {...props}
            onClose={() => void setAddress('')}
            title="Add member"
        >
            <Form
                onSubmit={() => {
                    if (typeof onSubmit === 'function' && canSubmit) {
                        onSubmit(address)
                    }
                }}
            >
                <Label>Member address</Label>
                <TextField
                    placeholder="0x…"
                    value={address}
                    onChange={(e) => void setAddress(e.target.value)}
                />
                <Submit label="Add" disabled={!canSubmit} />
            </Form>
        </Modal>
    )
}
