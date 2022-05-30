import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import { Address, OptionalAddress } from '../../../types/common'
import { useDelegatedAccount } from '../delegation/hooks'
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

function useLoadAbilityEffect(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    const dispatch = useDispatch()

    useEffect(() => {
        if (!roomId || !address) {
            return
        }

        dispatch(
            fetchPermission({
                roomId,
                address,
                permission,
            })
        )
    }, [roomId, address, permission])
}

export function useLoadCurrentAbilityEffect(permission: StreamPermission) {
    const selectedRoomId = useSelectedRoomId()

    const account = useWalletAccount()

    useLoadAbilityEffect(selectedRoomId, account, permission)
}

export function useCurrentDelegationAbility(permission: StreamPermission) {
    return useAbility(useSelectedRoomId(), useDelegatedAccount(), permission)
}

export function useLoadCurrentDelegationAbilityEffect(permission: StreamPermission) {
    const selectedRoomId = useSelectedRoomId()

    const delegatedAccount = useDelegatedAccount()

    useLoadAbilityEffect(selectedRoomId, delegatedAccount, permission)
}
