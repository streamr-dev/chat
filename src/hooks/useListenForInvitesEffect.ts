import { BigNumber } from 'ethers'
import { useEffect, useRef } from 'react'
import { Address, OptionalAddress, Prefix } from '$/types'
import { RoomId } from '$/features/room/types'
import { NOOP } from '$/utils/consts'
import isSameAddress from '$/utils/isSameAddress'
import useStreamRegistry from './useStreamRegistry'

export default function useListenForInvitesEffect(
    address: OptionalAddress,
    onInvite: (roomId: RoomId, address: Address) => void
) {
    const registry = useStreamRegistry()

    const onInviteRef = useRef(onInvite)

    useEffect(() => {
        onInviteRef.current = onInvite
    }, [onInvite])

    useEffect(() => {
        if (!address || !registry) {
            return NOOP
        }

        let mounted = true

        const filter = registry.filters.PermissionUpdated(
            // streamId
            null,
            // user
            null,
            // canEdit
            null,
            // canDelete
            null,
            // publishExpiration
            null,
            // subscribeExpiration
            null,
            // canGrant
            null
        )

        function onData(
            streamId: string,
            userAddress: string,
            canEdit: boolean,
            canDelete: boolean,
            publishExpirationTimestampSeconds: BigNumber,
            subscribeExpirationTimestampSeconds: BigNumber,
            canGrant: boolean
        ) {
            // Every PermissionUpdated event comes back with 2 calls to `onData`.
            if (!mounted) {
                return
            }

            if (!canGrant) {
                return
            }

            const now = Date.now()

            const canSub = subscribeExpirationTimestampSeconds.gt(now)

            const canPub = publishExpirationTimestampSeconds.gt(now)

            if (!(canPub && canSub && canGrant)) {
                return
            }
            // It's an invite.

            if (!isSameAddress(userAddress, address) || !streamId.includes(Prefix.Room)) {
                // Irrelevant. Skipping.
                return
            }

            if (typeof onInviteRef.current === 'function') {
                onInviteRef.current(streamId, userAddress)
            }
        }

        registry.on(filter, onData)

        return () => {
            mounted = false
            registry.off(filter, onData)
        }
    }, [address, registry])
}
