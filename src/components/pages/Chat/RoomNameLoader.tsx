import { useEffect } from 'react'
import { RoomId } from '../../../utils/types'
import { ActionType, useDispatch, useStore } from '../../Store'

type Props = {
    roomId: RoomId
}

export default function RoomNameLoader({ roomId }: Props) {
    const {
        session: { streamrClient },
    } = useStore()

    const dispatch = useDispatch()

    useEffect(() => {
        async function fn() {
            if (!streamrClient) {
                return
            }

            const stream = await streamrClient.getStream(roomId)

            dispatch({
                type: ActionType.RenameRoom,
                payload: {
                    [roomId]: stream.description || '',
                },
            })
        }

        fn()
    }, [roomId, streamrClient, dispatch])

    return null
}
