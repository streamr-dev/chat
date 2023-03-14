import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletClient } from '$/features/wallet/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// @TODO: Move to sagas and drop.

export default function useDetectMembersEffect() {
    const selectedRoomId = useSelectedRoomId()

    const streamrClient = useWalletClient()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!selectedRoomId || !streamrClient) {
            return
        }

        dispatch(
            PermissionsAction.detectRoomMembers({
                roomId: selectedRoomId,
                streamrClient,
                fingerprint: Flag.isDetectingMembers(selectedRoomId),
            })
        )
    }, [dispatch, selectedRoomId, streamrClient])
}
