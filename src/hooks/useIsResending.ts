import { RoomId } from '$/features/room/types'
import { OptionalAddress, State } from '$/types'
import isSameAddress from '$/utils/isSameAddress'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

function selectFlags(state: State) {
    return state.flag
}

export default function useIsResending(roomId: undefined | RoomId, requester: OptionalAddress) {
    const flags = useSelector(selectFlags)

    return useMemo(() => {
        if (!roomId || !requester) {
            return false
        }

        return Object.keys(flags).some((flag) => {
            const [key, rid, addr] = JSON.parse(flag)

            if (
                key !== 'isResendingMessage' &&
                key !== 'isResendingMessagesForSpecificDay' &&
                key !== 'isResendingTimestamp'
            ) {
                return false
            }

            if (roomId !== rid || !isSameAddress(addr, requester)) {
                return false
            }

            return true
        })
    }, [flags, roomId, requester])
}
