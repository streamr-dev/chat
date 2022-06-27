import { useDispatch, useSelector } from 'react-redux'
import { OptionalAddress } from '$/types'
import { selectNoticedAt } from './selectors'
import { RoomId } from '$/features/room/types'
import { selectFlag } from '$/features/flag/selectors'
import { MemberAction } from '$/features/member'
import { useCallback } from 'react'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { Flag } from '$/features/flag/types'

export function useNoticedAt(address: OptionalAddress): number {
    return useSelector(selectNoticedAt(address)) || Number.NEGATIVE_INFINITY
}

export function useIsMemberBeingRemoved(roomId: undefined | RoomId, address: OptionalAddress) {
    if (!roomId || !address) {
        return false
    }

    return useSelector(selectFlag(Flag.isMemberBeingRemoved(roomId, address)))
}

export function useIsInviteBeingAccepted() {
    const member = useWalletAccount()

    const delegatedAddress = useDelegatedAccount()

    const roomId = useSelectedRoomId()

    if (!roomId || !member || !delegatedAddress) {
        return false
    }

    return useSelector(selectFlag(Flag.isInviteBeingAccepted(roomId, member, delegatedAddress)))
}

export function useAcceptInvite() {
    const dispatch = useDispatch()

    const delegatedAddress = useDelegatedAccount()

    const roomId = useSelectedRoomId()

    const member = useWalletAccount()

    const provider = useWalletProvider()

    const requester = useWalletAccount()

    const streamrClient = useWalletClient()

    return useCallback(() => {
        if (!member || !delegatedAddress || !roomId || !provider || !requester || !streamrClient) {
            return
        }

        dispatch(
            MemberAction.acceptInvite({
                member,
                delegatedAddress,
                roomId,
                provider,
                requester,
                streamrClient,
                fingerprint: Flag.isInviteBeingAccepted(roomId, member, delegatedAddress),
            })
        )
    }, [member, delegatedAddress, roomId, provider, requester, streamrClient])
}

export function useIsDelegatedAccountBeingPromoted() {
    const roomId = useSelectedRoomId()

    const delegatedAddress = useDelegatedAccount()

    if (!roomId || !delegatedAddress) {
        return false
    }

    return useSelector(selectFlag(Flag.isDelegatedAccountBeingPromoted(roomId, delegatedAddress)))
}

export function usePromoteDelegatedAccount() {
    const dispatch = useDispatch()

    const roomId = useSelectedRoomId()

    const delegatedAddress = useDelegatedAccount()

    const provider = useWalletProvider()

    const requester = useWalletAccount()

    const streamrClient = useWalletClient()

    return useCallback(() => {
        if (!roomId || !delegatedAddress || !provider || !requester || !streamrClient) {
            return
        }

        dispatch(
            MemberAction.promoteDelegatedAccount({
                roomId,
                delegatedAddress,
                provider,
                requester,
                streamrClient,
                fingerprint: Flag.isDelegatedAccountBeingPromoted(roomId, delegatedAddress),
            })
        )
    }, [roomId, delegatedAddress, provider, requester, streamrClient])
}
