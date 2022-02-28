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
            if (stream.description){
                const description = JSON.parse(stream.description)
                console.log('stream description', description)
                dispatch({
                    type: ActionType.RenameRoom,
                    payload: {
                        [roomId]: description.name || '',
                    },
                })
            } else {
                console.log('stream id', stream.id)
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
