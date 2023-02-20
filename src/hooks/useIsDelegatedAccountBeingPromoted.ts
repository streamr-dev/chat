import { useDelegatedAccount } from '$/features/delegation/hooks'
import { Flag } from '$/features/flag/types'
import { useSelectedRoomId } from '$/features/room/hooks'
import useFlag from '$/hooks/useFlag'

export default function useIsDelegatedAccountBeingPromoted() {
    const roomId = useSelectedRoomId()

    const delegatedAddress = useDelegatedAccount()

    return useFlag(
        roomId && delegatedAddress
            ? Flag.isDelegatedAccountBeingPromoted(roomId, delegatedAddress)
            : undefined
    )
}
