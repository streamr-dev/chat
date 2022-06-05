import { useLiveQuery } from 'dexie-react-hooks'
import { RoomId } from '../features/room/types'
import { useWalletAccount } from '../features/wallet/hooks'
import db from '../utils/db'

export default function useRecentMessage(roomId: RoomId) {
    const account = useWalletAccount() || ''

    return useLiveQuery(
        () =>
            db.messages
                .where({
                    owner: account.toLowerCase(),
                    roomId,
                })
                .last(),
        [roomId, account]
    )
}
