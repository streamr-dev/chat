import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StreamPermission } from 'streamr-client'
import { useTickedAt } from '../features/clock/hooks'
import { useDelegatedAccount, useDelegatedClient } from '../features/delegation/hooks'
import { publishMessage } from '../features/messages/actions'
import { Instruction, MessageType } from '../features/messages/types'
import { useAbility, useLoadAbilityEffect } from '../features/permissions/hooks'
import { RoomId } from '../features/rooms/types'
import { useWalletAccount } from '../features/wallet/hooks'

export default function useEmitPresenceEffect(roomId: undefined | RoomId) {
    const address = useWalletAccount()

    const tickedAt = useTickedAt()

    const delegatedClient = useDelegatedClient()

    const dispatch = useDispatch()

    const delegatedAccount = useDelegatedAccount()

    const canDelegatedPublish = useAbility(roomId, delegatedAccount, StreamPermission.PUBLISH)

    useLoadAbilityEffect(roomId, delegatedAccount, StreamPermission.PUBLISH)

    useEffect(() => {
        if (!delegatedClient || !tickedAt || !roomId || !address || !canDelegatedPublish) {
            return
        }

        dispatch(
            publishMessage({
                content: Instruction.UpdateSeenAt,
                roomId,
                type: MessageType.Instruction,
            })
        )
    }, [delegatedClient, tickedAt, roomId, address, canDelegatedPublish])
}
