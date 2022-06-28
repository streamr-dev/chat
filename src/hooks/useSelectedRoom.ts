import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import { useShowHiddenRooms } from '$/features/preferences/hooks'
import handleError from '$/utils/handleError'

export default function useSelectedRoom() {
    const roomId = useSelectedRoomId()

    const owner = useWalletAccount()?.toLowerCase()

    const showHiddenRooms = useShowHiddenRooms()

    return useLiveQuery(async () => {
        if (roomId && owner) {
            try {
                return await db.rooms
                    .where({ owner, id: roomId })
                    .and(({ hidden }) => showHiddenRooms || hidden !== true)
                    .first()
            } catch (e) {
                handleError(e)
            }
        }

        return null
    }, [roomId, owner, showHiddenRooms])
}
