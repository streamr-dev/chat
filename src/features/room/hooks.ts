import { useSelector } from 'react-redux'
import { selectSelectedRoomId } from './selectors'

export function useSelectedRoomId() {
    return useSelector(selectSelectedRoomId)
}
