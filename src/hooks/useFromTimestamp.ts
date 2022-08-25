import { selectFromTimestamp } from '$/features/message/selectors'
import { RoomId } from '$/features/room/types'
import { OptionalAddress } from '$/types'
import { useSelector } from 'react-redux'

export default function useFromTimestamp(roomId: undefined | RoomId, requester: OptionalAddress) {
    return useSelector(selectFromTimestamp(roomId, requester))
}
