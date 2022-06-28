import { useLiveQuery } from 'dexie-react-hooks'
import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

export default function useRecentMessage(roomId: RoomId) {
    const owner = useWalletAccount()?.toLowerCase()

    return useLiveQuery(async () => {
        if (owner) {
            try {
                return await db.messages
                    .where({
                        owner,
                        roomId,
                    })
                    .last()
            } catch (e) {
                handleError(e)
            }
        }

        return null
    }, [roomId, owner])
}
