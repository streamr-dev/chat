import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import { PermissionAction } from '.'
import { Address, OptionalAddress } from '$/types'
import { useDelegatedAccount } from '../delegation/hooks'
import { useSelectedRoomId } from '../room/hooks'
import { RoomId } from '../room/types'
import { useWalletAccount, useWalletClient } from '../wallet/hooks'
import { selectAbility, selectPermissionCache, selectPermissions } from './selectors'
import formatFingerprint from '$/utils/formatFingerprint'

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

function useAbilityCache(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    return useSelector(selectPermissionCache(roomId, address, permission))
}

export function useLoadAbilityEffect(
    roomId: undefined | RoomId,
    address: OptionalAddress,
    permission: StreamPermission
) {
    const dispatch = useDispatch()

    const cache = useAbilityCache(roomId, address, permission)

    const streamrClient = useWalletClient()

    useEffect(() => {
        if (!roomId || !address || !streamrClient) {
            return
        }

        dispatch(
            PermissionAction.fetch({
                roomId,
                address,
                permission,
                streamrClient,
                fingerprint: formatFingerprint(
                    PermissionAction.fetch.toString(),
                    roomId,
                    address.toLowerCase(),
                    permission
                ),
            })
        )
    }, [roomId, address, permission, cache, streamrClient])
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

export function usePermissions(roomId: undefined | RoomId, address: OptionalAddress) {
    return useSelector(selectPermissions(roomId, address))
}
