import { useEffect } from 'react'
import getRoomMetadata from '../../../getters/getRoomMetadata'
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
            let roomName = stream.id as string
            try {
                roomName = getRoomMetadata(stream.description!).name
            } catch (e) {}
            dispatch({
                type: ActionType.RenameRoom,
                payload: {
                    [roomId]: roomName || '',
                },
            })
        }

        fn()
    }, [roomId, streamrClient, dispatch])

    return null
}
