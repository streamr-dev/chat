import { useState } from 'react'
import isBlank from '../../utils/isBlank'
import Form from '../Form'
import Label from '../Label'
import Modal, { ModalProps } from './Modal'
import Submit from '../Submit'
import TextField from '../TextField'
import { Address } from '../../../types/common'
import { useDispatch } from 'react-redux'
import { useSelectedRoomId } from '../../features/room/hooks'
import { StreamPermission } from 'streamr-client'
import { MemberAction } from '../../features/member'

type Props = ModalProps & {
    canModifyMembers?: boolean
}

export default function AddMemberModal({ canModifyMembers = false, setOpen, ...props }: Props) {
    const [address, setAddress] = useState<Address>('')

    const canSubmit = !isBlank(address) && canModifyMembers

    const dispatch = useDispatch()

    function onClose() {
        setAddress('')
    }

    const selectedRoomId = useSelectedRoomId()

    return (
        <Modal {...props} setOpen={setOpen} onClose={onClose} title="Add member">
            <Form
                onSubmit={() => {
                    if (!canSubmit || !selectedRoomId) {
                        return
                    }

                    dispatch(
                        MemberAction.setPermissions({
                            roomId: selectedRoomId,
                            assignments: [
                                {
                                    user: address,
                                    permissions: [StreamPermission.GRANT],
                                },
                            ],
                        })
                    )

                    if (typeof setOpen === 'function') {
                        setOpen(false)
                        onClose()
                    }
                }}
            >
                <Label>Member address</Label>
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
