import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import handleError from '$/utils/handleError'

export default function useMessages() {
    const roomId = useSelectedRoomId()

    const owner = useWalletAccount()?.toLowerCase()

    return useLiveQuery(async () => {
        if (owner && roomId) {
            try {
                return await db.messages
                    .where({
                        owner,
                        roomId,
                    })
                    .toArray()
            } catch (e) {
                handleError
            }
        }

        return []
    }, [roomId, owner])
}
