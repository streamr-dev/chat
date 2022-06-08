import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectedRoomId } from '../features/room/hooks'
import { useWalletAccount } from '../features/wallet/hooks'
import db from '../utils/db'

export default function useSelectedRoom() {
    const id = useSelectedRoomId()

    const account = useWalletAccount()

    return useLiveQuery(
        () => db.rooms.where({ owner: (account || '').toLowerCase(), id: id || '' }).first(),
        [id, account]
    )
}
