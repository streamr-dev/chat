import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import { Address } from '../../../types/common'
import { useSelectedRoomId } from '../rooms/hooks'
import { RoomId } from '../rooms/types'
import { useWalletAccount } from '../wallet/hooks'
import { fetchPermission } from './actions'
import { selectAbility } from './selectors'

export function useAbility(
    roomId: undefined | RoomId,
    address: undefined | null | Address,
    permission: StreamPermission
): boolean {
    return useSelector(selectAbility(roomId, address, permission))
}

export function useCurrentAbility(permission: StreamPermission) {
    const selectedRoomId = useSelectedRoomId()

    const account = useWalletAccount()

    return useAbility(selectedRoomId, account, permission)
}

export function useLoadCurrentAbilityEffect(permission: StreamPermission) {
    const selectedRoomId = useSelectedRoomId()

    const account = useWalletAccount()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!selectedRoomId || !account) {
            return
        }

        dispatch(
            fetchPermission({
                roomId: selectedRoomId,
                address: account,
                permission,
            })
        )
    }, [selectedRoomId, account, permission])
}
