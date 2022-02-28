import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'
import useInviterSelf from './useInviterSelf'

export default function useCreateRoom(): (roomName: string) => Promise<void> {
    const {
        session: { wallet },
        account,
        metamaskStreamrClient,
    } = useStore()

    const sessionAccount = wallet?.address

    const inviteSelf = useInviterSelf()

    const dispatch = useDispatch()

    return useCallback(
        async (roomName: string) => {
            if (!sessionAccount) {
                throw new Error('Missing session account')
            }

            if (!account) {
                throw new Error('Missing account')
            }

            if (!metamaskStreamrClient) {
                throw new Error('Missing metamask streamr client')
            }

            const stream = await metamaskStreamrClient.createStream({
                id: `/streamr-chat/room/${roomName}`.toLowerCase(),
                partitions: 2,
                description: roomName,
            })

            console.info(`Created stream ${stream.id}`)

            await inviteSelf({
                streamIds: [stream.id],
            })

            console.info(
                `Invited session account ${sessionAccount} to stream ${stream.id}`
            )

            dispatch({
                type: ActionType.AddRoomIds,
                payload: [stream.id],
            })
        },
        [sessionAccount, metamaskStreamrClient, account, inviteSelf, dispatch]
    )
}
