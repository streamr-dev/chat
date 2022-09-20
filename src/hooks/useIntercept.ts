import { useCallback, useEffect } from 'react'
import { RoomId } from '$/features/room/types'
import { MessageStreamOnMessage, StreamPermission } from 'streamr-client'
import handleError from '$/utils/handleError'
import { useDispatch } from 'react-redux'
import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import { IMessage, StreamMessage } from '$/features/message/types'
import { MessageAction } from '$/features/message'
import { useWalletAccount } from '$/features/wallet/hooks'
import { useAbility, useLoadAbilityEffect } from '$/features/permission/hooks'
import toLocalMessage from '$/utils/toLocalMessage'

export default function useIntercept(roomId: RoomId) {
    const client = useDelegatedClient()

    const dispatch = useDispatch()

    const owner = useWalletAccount()

    const onMessage = useCallback(
        (message: Omit<IMessage, 'owner'>) => {
            if (!owner) {
                return
            }

            dispatch(
                MessageAction.register({
                    message,
                    owner,
                })
            )
        },
        [owner]
    )

    const delegatedAddress = useDelegatedAccount()

    const canDelegatedSubscribe = useAbility(roomId, delegatedAddress, StreamPermission.SUBSCRIBE)

    useLoadAbilityEffect(roomId, delegatedAddress, StreamPermission.SUBSCRIBE)

    useEffect(() => {
        let mounted = true

        let sub: any

        function unsub() {
            if (client && sub) {
                client.unsubscribe(sub)
            }

            sub = undefined
        }

        const onData: MessageStreamOnMessage<StreamMessage, void> = (_, raw) => {
            if (!mounted) {
                return
            }

            onMessage(toLocalMessage(raw))
        }

        async function fn() {
            if (!client || !mounted || !canDelegatedSubscribe) {
                return
            }

            try {
                sub = await client.subscribe(
                    {
                        streamId: roomId,
                    },
                    onData
                )

                sub.onError(handleError)
            } catch (e) {
                handleError(e)
            }

            if (!mounted) {
                unsub()
            }
        }

        fn()

        return () => {
            mounted = false
            unsub()
        }
    }, [client, roomId, onMessage, canDelegatedSubscribe])
}
