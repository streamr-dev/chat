import { useEffect } from 'react'
import { RoomId } from '$/features/room/types'
import { StreamPermission } from 'streamr-client'
import { useDispatch } from 'react-redux'
import { MessageAction } from '$/features/message'
import { useWalletAccount } from '$/features/wallet/hooks'
import useAbility from '$/hooks/useAbility'
import toLocalMessage from '$/utils/toLocalMessage'
import { subscribe } from 'streamr-client-react'
import { StreamMessage } from '$/features/message/types'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'
import useOperator from '$/hooks/useOperator'

export default function useIntercept(roomId: RoomId) {
    const owner = useWalletAccount()?.toLowerCase()

    const [account, client] = useOperator(roomId)

    const dispatch = useDispatch()

    const canOperatorSubscribe = useAbility(roomId, account, StreamPermission.SUBSCRIBE)

    useEffect(() => {
        let queue: undefined | ReturnType<typeof subscribe>

        async function fn() {
            if (!client || !canOperatorSubscribe || !owner) {
                return
            }

            queue = subscribe(roomId, client)

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
    }, [client, roomId, canOperatorSubscribe, owner])
}
