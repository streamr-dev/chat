import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { v4 as uuidv4 } from 'uuid'
import useInviter from './useInviter'
import StreamrClient from 'streamr-client'

export default function useCreateRoom(): () => Promise<void> {
    const {
        session: { wallet, streamrClient },
        account,
        ethereumProvider,
    } = useStore()

    const sessionAccount = wallet?.address

    const invite = useInviter()

    const dispatch = useDispatch()

    return useCallback(async () => {
        if (!sessionAccount) {
            throw new Error('Missing session account')
        }

        if (!streamrClient) {
            throw new Error('Missing session streamr client')
        }

        if (!account) {
            throw new Error('Missing account')
        }

        const id = `${account}/streamr-chat/room/${uuidv4()}`.toLowerCase()

        const metamaskStreamrClient = new StreamrClient({
            auth: { ethereum: ethereumProvider as any },
        })
        const stream = await metamaskStreamrClient.createStream({
            id,
            partitions: 2,
            // requireEncryptedData: false,
        })

        await invite({
            invitee: sessionAccount,
            stream,
        })

        dispatch({
            type: ActionType.AddRoomIds,
            payload: [id],
        })
    }, [
        sessionAccount,
        ethereumProvider,
        streamrClient,
        account,
        invite,
        dispatch,
    ])
}
