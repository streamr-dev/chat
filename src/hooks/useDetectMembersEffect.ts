import { Flag } from '$/features/flag/types'
import { PermissionsAction } from '$/features/permissions'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// @TODO: Move to sagas and drop.

export default function useDetectMembersEffect() {
    const selectedRoomId = useSelectedRoomId()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!selectedRoomId) {
            return
        }

        dispatch(
            PermissionsAction.detectRoomMembers({
                roomId: selectedRoomId,
                fingerprint: Flag.isDetectingMembers(selectedRoomId),
            })
        )
    }, [dispatch, selectedRoomId])
}
