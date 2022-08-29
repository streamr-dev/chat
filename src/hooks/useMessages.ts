import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import useFromTimestamp from '$/hooks/useFromTimestamp'

export default function useMessages() {
    const roomId = useSelectedRoomId()

    const owner = useWalletAccount()?.toLowerCase()

    const from = useFromTimestamp(roomId, owner)

    return useLiveQuery(async () => {
        if (owner && roomId && typeof from === 'number') {
            try {
                return await db.messages
                    .where(['owner', 'roomId'])
                    .equals([owner, roomId])
                    .and((msg) => typeof msg.createdAt === 'number' && msg.createdAt >= from)
                    .toArray()
            } catch (e) {
                handleError(e)
            }
        }

        return []
    }, [roomId, owner, from])
}
