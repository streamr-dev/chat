import { useDispatch, useSelector } from 'react-redux'
import { OptionalAddress, PrivacySetting } from '$/types'
import { RoomId } from '$/features/room/types'
import { selectFlag } from '$/features/flag/selectors'
import { MemberAction } from '$/features/member'
import { useCallback } from 'react'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import { usePrivacy, useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount, useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { Flag } from '$/features/flag/types'

export function useIsMemberBeingRemoved(roomId: undefined | RoomId, address: OptionalAddress) {
    return useSelector(
        selectFlag(roomId && address ? Flag.isMemberBeingRemoved(roomId, address) : undefined)
    )
}

export function useIsInviteBeingAccepted() {
    const member = useWalletAccount()

    const delegatedAddress = useDelegatedAccount()

    const roomId = useSelectedRoomId()

    return useSelector(
        selectFlag(
            roomId && member && delegatedAddress
                ? Flag.isInviteBeingAccepted(roomId, member, delegatedAddress)
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
                fingerprint: Flag.isInviteBeingAccepted(roomId, member, delegatedAddress),
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
                ? Flag.isDelegatedAccountBeingPromoted(roomId, delegatedAddress)
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

    const privacy = usePrivacy(roomId)

    return useCallback(() => {
        if (!roomId || !delegatedAddress || !provider || !requester || !streamrClient || !privacy) {
            return
        }

        if (privacy === PrivacySetting.TokenGated) {
            dispatch(
                MemberAction.tokenGatedPromoteDelegatedAccount({
                    roomId,
                    provider,
                    requester,
                    streamrClient,
                    fingerprint: Flag.isDelegatedAccountBeingPromoted(roomId, delegatedAddress),
                })
            )
        } else {
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
        }
    }, [roomId, delegatedAddress, provider, requester, streamrClient])
}
