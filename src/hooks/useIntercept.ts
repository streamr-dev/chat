import { useEffect } from 'react'
import { RoomId } from '$/features/room/types'
import { StreamPermission } from 'streamr-client'
import { useDispatch } from 'react-redux'
import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import { MessageAction } from '$/features/message'
import { useWalletAccount } from '$/features/wallet/hooks'
import { useAbility, useLoadAbilityEffect } from '$/features/permission/hooks'
import toLocalMessage from '$/utils/toLocalMessage'
import { subscribe } from 'streamr-client-react'
import { StreamMessage } from '$/features/message/types'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'

export default function useIntercept(roomId: RoomId) {
    const client = useDelegatedClient()

    const dispatch = useDispatch()

    const owner = useWalletAccount()?.toLowerCase()

    const delegatedAddress = useDelegatedAccount()

    const canDelegatedSubscribe = useAbility(roomId, delegatedAddress, StreamPermission.SUBSCRIBE)

    useLoadAbilityEffect(roomId, delegatedAddress, StreamPermission.SUBSCRIBE)

    useEffect(() => {
        let queue: undefined | ReturnType<typeof subscribe>

        async function fn() {
            if (!client || !canDelegatedSubscribe || !owner) {
                return
            }

            queue = subscribe(roomId, client)

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { value, done } = await queue.next()

                if (value) {
                    dispatch(
                        MessageAction.register({
                            message: toLocalMessage(value as StreamrMessage<StreamMessage>),
                            owner,
                        })
                    )
                }

                if (done) {
                    break
                }
            }
        }

        fn()

        return () => {
            queue?.abort()
        }
    }, [client, roomId, canDelegatedSubscribe, owner])
}
