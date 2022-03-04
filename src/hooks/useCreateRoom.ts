import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { v4 as uuidv4 } from 'uuid'
import useInviter from './useInviter'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'
import { RoomMetadata } from '../utils/types'

export default function useCreateRoom(): () => Promise<void> {
    const {
        session: { wallet },
        account,
        metamaskStreamrClient,
    } = useStore()

    const sessionAccount = wallet?.address

    const invite = useInviter()

    const dispatch = useDispatch()

    return useCallback(async () => {
        if (!sessionAccount) {
            throw new Error('Missing session account')
        }

        if (!account) {
            throw new Error('Missing account')
        }

        if (!metamaskStreamrClient) {
            throw new Error('Missing metamask streamr client')
        }

        const id = `${account}/streamr-chat/room/${uuidv4()}`.toLowerCase()
        const description: RoomMetadata = {
            name: getRoomNameFromRoomId(id),
            createdAt: Date.now(),
        }

        const stream = await metamaskStreamrClient.createStream({
            id,
            partitions: 2,
            description: JSON.stringify(description),
        })

        await invite({
            invitees: [sessionAccount],
            stream,
        })

        dispatch({
            type: ActionType.AddRoomIds,
            payload: [id],
        })
    }, [sessionAccount, metamaskStreamrClient, account, invite, dispatch])
}
