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
import { useWalletAccount } from '$/features/wallet/hooks'

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
    const address = useWalletAccount()

    const delegatedAddress = useDelegatedAccount()

    const roomId = useSelectedRoomId()

    return useSelector(
        selectFlag(
            roomId && address && delegatedAddress
                ? formatFingerprint(
                      MemberAction.acceptInvite.toString(),
                      roomId,
                      address.toLowerCase(),
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

    const address = useWalletAccount()

    return useCallback(() => {
        if (!address || !delegatedAddress || !roomId) {
            return
        }

        dispatch(
            MemberAction.acceptInvite({
                address,
                delegatedAddress,
                roomId,
                fingerprint: formatFingerprint(
                    MemberAction.acceptInvite.toString(),
                    roomId,
                    address.toLowerCase(),
                    delegatedAddress.toLowerCase()
                ),
            })
        )
    }, [address, delegatedAddress, roomId])
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

    return useCallback(() => {
        if (!roomId || !delegatedAddress) {
            return
        }

        dispatch(
            MemberAction.promoteDelegatedAccount({
                roomId,
                delegatedAddress,
                fingerprint: formatFingerprint(
                    MemberAction.promoteDelegatedAccount.toString(),
                    roomId,
                    delegatedAddress.toLowerCase()
                ),
            })
        )
    }, [roomId, delegatedAddress])
}
