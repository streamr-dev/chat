import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { useLiveQuery } from 'dexie-react-hooks'

export default function useIsRoomPinned(roomId: undefined | RoomId) {
    const owner = useWalletAccount()?.toLowerCase()

    const room = useLiveQuery(async () => {
        if (roomId && owner) {
            try {
                return await db.rooms.where({ id: roomId, owner }).first()
            } catch (e) {
                handleError(e)
            }
        }

        return null
    }, [roomId, owner])

    return Boolean(room?.pinned)
}
