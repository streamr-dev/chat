import { Flag } from '$/features/flag/types'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useFlag from '$/hooks/useFlag'

export default function useIsInviteBeingAccepted() {
    const member = useWalletAccount()

    const roomId = useSelectedRoomId()

    return useFlag(roomId && member ? Flag.isInviteBeingAccepted(roomId, member) : undefined)
}
