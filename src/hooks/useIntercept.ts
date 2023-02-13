import { useEffect } from 'react'
import { RoomId } from '$/features/room/types'
import { useDispatch } from 'react-redux'
import { MessageAction } from '$/features/message'
import { useWalletAccount } from '$/features/wallet/hooks'
import toLocalMessage from '$/utils/toLocalMessage'
import { subscribe } from 'streamr-client-react'
import { StreamMessage } from '$/features/message/types'
import { StreamMessage as StreamrMessage } from 'streamr-client-protocol'
import useSubscriber from '$/hooks/useSubscriber'

export default function useIntercept(roomId: RoomId) {
    const owner = useWalletAccount()?.toLowerCase()

    const client = useSubscriber(roomId)

    const dispatch = useDispatch()

    useEffect(() => {
        let queue: undefined | ReturnType<typeof subscribe>

        async function fn() {
            if (!client || !owner) {
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
    }, [client, roomId, owner])
}
