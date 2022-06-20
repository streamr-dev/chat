import { useDispatch, useSelector } from 'react-redux'
import { OptionalAddress } from '$/types'
import { selectNoticedAt } from './selectors'
import { RoomId } from '$/features/room/types'
import { selectFlag } from '$/features/flag/selectors'
import formatFingerprint from '$/utils/formatFingerprint'
import { MemberAction } from '$/features/member'
import { useCallback } from 'react'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'

export function useNoticedAt(address: OptionalAddress): number {
    return useSelector(selectNoticedAt(address)) || Number.NEGATIVE_INFINITY
}

export function useIsMemberBeingRemoved(roomId: undefined | RoomId, address: OptionalAddress) {
    return useSelector(
        selectFlag(
            roomId && address
                ? formatFingerprint(MemberAction.remove.toString(), roomId, address.toLowerCase())
                : undefined
        )
    )
}

export function useIsInviteBeingAccepted() {
    const member = useWalletAccount()

    const delegatedAddress = useDelegatedAccount()

    const roomId = useSelectedRoomId()

    return useSelector(
        selectFlag(
            roomId && member && delegatedAddress
                ? formatFingerprint(
                      MemberAction.acceptInvite.toString(),
                      roomId,
                      member.toLowerCase(),
                      delegatedAddress.toLowerCase()
                  )
                : undefined
        )
    )
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
                fingerprint: formatFingerprint(
                    MemberAction.acceptInvite.toString(),
                    roomId,
                    member.toLowerCase(),
                    delegatedAddress.toLowerCase()
                ),
            })
        )
    }, [member, delegatedAddress, roomId, provider, requester, streamrClient])
}

export function useIsDelegatedAccountBeingPromoted() {
    const roomId = useSelectedRoomId()

    const delegatedAddress = useDelegatedAccount()

    return useSelector(
        selectFlag(
            roomId && delegatedAddress
                ? formatFingerprint(
                      MemberAction.promoteDelegatedAccount.toString(),
                      roomId,
                      delegatedAddress.toLowerCase()
                  )
                : undefined
        )
    )
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
                fingerprint: formatFingerprint(
                    MemberAction.promoteDelegatedAccount.toString(),
                    roomId,
                    delegatedAddress.toLowerCase()
                ),
            })
        )
    }, [roomId, delegatedAddress, provider, requester, streamrClient])
}
