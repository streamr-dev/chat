import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectedRoomId } from '../features/room/hooks'
import { useWalletAccount } from '../features/wallet/hooks'
import db from '../utils/db'

export default function useMessages() {
    const selectedRoomId = useSelectedRoomId() || ''

    const account = useWalletAccount() || ''

    return useLiveQuery(
        () =>
            db.messages
                .where({
                    owner: account.toLowerCase(),
                    roomId: selectedRoomId,
                })
                .toArray(),
        [selectedRoomId, account]
    )
}
