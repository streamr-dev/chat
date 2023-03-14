import AddMemberModal from '$/components/modals/AddMemberModal'
import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import useModalDialog from '$/hooks/useModalDialog'
import { OptionalAddress } from '$/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useAddMemberModal() {
    const { open: openModal, modal } = useModalDialog(AddMemberModal)

    const dispatch = useDispatch()

    const roomId = useSelectedRoomId()

    const streamrClient = useWalletClient()

    const requester = useWalletAccount()

    const open = useCallback(async () => {
        if (!roomId || !streamrClient || !requester) {
            return
        }

        let member: OptionalAddress

        try {
            member = await openModal()
        } catch (e) {
            // Noop
        }

        if (member == null) {
            return
        }

        dispatch(
            PermissionsAction.addMember({
                roomId,
                member,
                requester,
                streamrClient,
                fingerprint: Flag.isMemberBeingAdded(roomId, member),
            })
        )
    }, [openModal, roomId, streamrClient, requester])

    return {
        open,
        modal,
    }
}
