import { RoomId } from '$/features/room/types'
import { OptionalAddress, State } from '$/types'
import { useSelector } from 'react-redux'

function selectPermissions(roomId: undefined | RoomId, address: OptionalAddress) {
    if (!roomId || !address) {
        return () => ({})
    }

    return (state: State) => state.permissions.permissions[roomId]?.[address.toLowerCase()] || {}
}

export default function usePermissions(roomId: undefined | RoomId, address: OptionalAddress) {
    return useSelector(selectPermissions(roomId, address))
}
