import { useSelector } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'
import { selectAbility } from './selectors'

export function useAbility(
    roomId: undefined | RoomId,
    address: undefined | null | Address,
    permission: StreamPermission
): boolean {
    return useSelector(selectAbility(roomId, address, permission))
}
