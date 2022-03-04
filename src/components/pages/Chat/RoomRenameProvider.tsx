import { createContext, useCallback, useContext } from 'react'
import getRoomMetadata from '../../../getters/getRoomMetadata'
import { RoomId } from '../../../utils/types'
import { ActionType, useDispatch, useStore } from '../../Store'

type RoomRenamer = (roomId: RoomId, newName: string) => Promise<void>

const RenameContext = createContext<RoomRenamer>(async () => {})

type Props = {
    children?: React.ReactNode
}

export function useRenameRoom(): RoomRenamer {
    return useContext(RenameContext)
}

export default function RoomRenameProvider({ children }: Props) {
    const dispatch = useDispatch()

    const {
        session: { streamrClient },
    } = useStore()

    const rename = useCallback(
        async (roomId, newName) => {
            if (!streamrClient) {
                throw new Error('Missing streamr client')
            }

            const stream = await streamrClient.getStream(roomId)
            stream.description = JSON.stringify({
                ...getRoomMetadata(stream.description),
                name: newName,
            })

            await stream.update()

            dispatch({
                type: ActionType.RenameRoom,
                payload: {
                    [roomId]: newName,
                },
            })
        },
        [dispatch, streamrClient]
    )

    return (
        <RenameContext.Provider value={rename}>
            {children}
        </RenameContext.Provider>
    )
}
