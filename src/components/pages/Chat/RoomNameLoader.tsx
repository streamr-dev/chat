import { useEffect } from 'react'
import getRoomDescription from '../../../getters/getRoomDescription'
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
            try {
                const description = getRoomDescription(stream)
                dispatch({
                    type: ActionType.RenameRoom,
                    payload: {
                        [roomId]: description.name || '',
                    },
                })
            } catch (e) {
                dispatch({
                    type: ActionType.RenameRoom,
                    payload: {
                        [roomId]: stream.id || '',
                    },
                })
            }
        }

        fn()
    }, [roomId, streamrClient, dispatch])

    return null
}
