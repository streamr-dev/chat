import { useState } from 'react'
import isBlank from '$/utils/isBlank'
import Form from '../Form'
import Label from '../Label'
import Modal, { ModalProps } from './Modal'
import Submit from '../Submit'
import TextField from '../TextField'
import { Address } from '$/types'
import { useDispatch } from 'react-redux'
import { useSelectedRoomId } from '$/features/room/hooks'
import { MemberAction } from '$/features/member'
import formatFingerprint from '$/utils/formatFingerprint'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'

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

    const roomId = useSelectedRoomId()

    const provider = useWalletProvider()

    const streamrClient = useWalletClient()

    const requester = useWalletAccount()

    return (
        <Modal {...props} setOpen={setOpen} onClose={onClose} title="Add member">
            <Form
                onSubmit={() => {
                    if (!canSubmit || !roomId || !provider || !streamrClient || !requester) {
                        return
                    }

                    dispatch(
                        MemberAction.add({
                            roomId,
                            member: address,
                            provider,
                            requester,
                            streamrClient,
                            fingerprint: formatFingerprint(
                                MemberAction.add.toString(),
                                roomId,
                                address.toLowerCase()
                            ),
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
