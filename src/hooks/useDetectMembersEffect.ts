import { Flag } from '$/features/flag/types'
import { MembersAction } from '$/features/members'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletClient, useWalletProvider } from '$/features/wallet/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function useDetectMembersEffect() {
    const selectedRoomId = useSelectedRoomId()

    const streamrClient = useWalletClient()

    const provider = useWalletProvider()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!selectedRoomId || !streamrClient || !provider) {
            return
        }

        dispatch(
            MembersAction.detect({
                roomId: selectedRoomId,
                streamrClient,
                fingerprint: Flag.isDetectingMembers(selectedRoomId),
                provider,
            })
        )
    }, [dispatch, selectedRoomId, streamrClient])
}
