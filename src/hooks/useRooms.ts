import { useLiveQuery } from 'dexie-react-hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import { useShowHiddenRooms } from '$/features/preferences/hooks'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

export default function useRooms() {
    const owner = useWalletAccount()?.toLowerCase()

    const showHiddenRooms = useShowHiddenRooms()

    return useLiveQuery(async () => {
        if (owner) {
            try {
                const rooms = await db.rooms
                    .where({ owner })
                    .and((room) => showHiddenRooms || room.hidden !== true)
                    .toArray()

                return rooms.sort(({ recentMessageAt: a = 0 }, { recentMessageAt: b = 0 }) => b - a)
            } catch (e) {
                handleError(e)
            }
        }

        return null
    }, [owner, showHiddenRooms])
}
