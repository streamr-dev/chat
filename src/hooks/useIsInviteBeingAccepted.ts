import { useDelegatedAccount } from '$/features/delegation/hooks'
import { Flag } from '$/features/flag/types'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useFlag from '$/hooks/useFlag'

export default function useIsInviteBeingAccepted() {
    const member = useWalletAccount()

    const delegatedAddress = useDelegatedAccount()

    const roomId = useSelectedRoomId()

    return useFlag(
        roomId && member && delegatedAddress
            ? Flag.isInviteBeingAccepted(roomId, member, delegatedAddress)
            : undefined
    )
}
