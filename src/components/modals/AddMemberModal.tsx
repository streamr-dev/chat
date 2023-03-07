import { useState } from 'react'
import isBlank from '$/utils/isBlank'
import Form from '../Form'
import Label from '../Label'
import Submit from '../Submit'
import TextField from '../TextField'
import { Address } from '$/types'
import Modal, { AbortReason, Props as ModalProps } from '$/components/modals/Modal'
import useCanGrant from '$/hooks/useCanGrant'
import i18n from '$/utils/I18n'

interface Props extends ModalProps {
    onProceed?: (address: Address) => void
}

export default function AddMemberModal({
    title = i18n('addMemberModal.title'),
    onProceed,
    ...props
}: Props) {
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
                <Label>{i18n('addMemberModal.memberFieldLabel')}</Label>
                <TextField
                    autoFocus
                    placeholder={i18n('addMemberModal.memberFieldPlaceholder')}
                    value={address}
                    onChange={(e) => void setAddress(e.target.value)}
                />
                <Submit label={i18n('addMemberModal.addButtonLabel')} disabled={!canSubmit} />
            </Form>
        </Modal>
    )
}

AddMemberModal.displayName = 'AddMemberModal'
