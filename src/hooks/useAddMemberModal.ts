import AddMemberModal from '$/components/modals/AddMemberModal'
import { Flag } from '$/features/flag/types'
import { MemberAction } from '$/features/member'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import useModalDialog from '$/hooks/useModalDialog'
import { OptionalAddress } from '$/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useAddMemberModal() {
    const { open: openModal, modal } = useModalDialog(AddMemberModal)

    const dispatch = useDispatch()

    const roomId = useSelectedRoomId()

    const provider = useWalletProvider()

    const streamrClient = useWalletClient()

    const requester = useWalletAccount()

    const open = useCallback(async () => {
        if (!roomId || !provider || !streamrClient || !requester) {
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
            MemberAction.add({
                roomId,
                member,
                provider,
                requester,
                streamrClient,
                fingerprint: Flag.isMemberBeingAdded(roomId, member),
            })
        )
    }, [openModal, roomId, provider, streamrClient, requester])

    return {
        open,
        modal,
    }
}
